const router = require('express').Router();
const axios = require('axios');
const Utils = require('./Utils');

// TODO: Use query builder here
var URL = "http://stats.nba.com/stats/leagueLeaders?LeagueID=00&PerMode=PerGame&Scope=S&Season=2015-16&SeasonType=Regular+Season&StatCategory=PTS";

function standardDeviation(values) {
  var avg = average(values);

  var squareDiffs = values.map(function(value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

function average(data) {
  var sum = data.reduce(function(sum, value) {
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}

function keepProps(obj, keep) {
  for (var prop in obj) {
    if (keep.indexOf(prop) == -1) {
      delete obj[prop];
    }
  }
}

router.get("/stdevsort", (req, res) => {
  axios.get(URL).then((response) => {
    console.log(response);
    var dataArr = Utils.formatJSONArray(response.data.resultSet.headers, response.data.resultSet.rowSet);

    var cats = [
      "PLAYER",
      "PTS",
      "REB",
      "FG_PCT",
      "FG3M",
      "STL",
      "BLK",
      "TOV",
      "AST",
      "FT_PCT"
    ];

    response.data.resultSet.headers.map((header) => {
      if (header == "PLAYER") {
        return;
      }

      var dataFiltered = new Array();
      dataArr.map((player) => {
        dataFiltered.push(player[header]);
      })
      var headerStdDev = standardDeviation(dataFiltered);
      var headerAvg = average(dataFiltered)

      dataArr.map((player) => {
        player[header] = (player[header] - headerAvg) / headerStdDev;
      })
    })

    dataArr.map((player) => {
      keepProps(player, cats);
    })

    PUNTEDCATS = ["PTS", "PLAYER"];

    dataArr.map((players) => {
      var sum = 0;
      cats.map((cat) => {
        if (PUNTEDCATS.indexOf(cat) == -1) {
          sum += players[cat];
        }
      })

      players["Total"] = sum;

    })

    dataArr.map((player) => {
      keepProps(player, ["PLAYER", "Total"]);
    })

    dataArr.sort(function(a, b) {
      return b.Total - a.Total;
    });

    res.json({"test": dataArr})
  })
})

router.get("/allplayers", (req, res) => {
  axios.get(URL).then((response) => {
    console.log(response);
    res.json({
      "test": Utils.formatJSONArray(response.data.resultSet.headers, response.data.resultSet.rowSet)
    })
  })
})

router.get("/team/:team", (req, res) => {
  axios.get(URL).then((response) => {

    var filtered = new Array();
    response.data.resultSet.rowSet.map((elem) => {
      if (elem[3] == req.params.team) {
        filtered.push(elem);
      }
    })
    console.log(filtered.length);
    res.json({
      "test": Utils.formatJSONArray(response.data.resultSet.headers, filtered)
    });
  })
})

router.get("/average/:team", (req, res) => {
  axios.get(URL).then((response) => {

    var filtered = new Array();
    response.data.resultSet.rowSet.map((elem) => {
      if (elem[3] == req.params.team) {
        filtered.push(elem);
      }
    })

    res.json({
      "test": Utils.statAverage(response.data.resultSet.headers, Utils.formatJSONArray(response.data.resultSet.headers, filtered))
    });
  })
})

module.exports = router;
