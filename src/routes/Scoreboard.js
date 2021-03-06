const router = require('express').Router();
const axios = require('axios');
const Utils = require('./Utils');
const moment = require('moment');
const Promise = require('bluebird');

/*
How to get the individual game stats of a player.

1. Find the id of the game using the scoreboard endpoint.
http://stats.nba.com/js/data/widgets/boxscore_breakdown_20170201.json
  - go through each item in the results array and find if either the home team or away team is the one you want
    (seems to be the abbv for every team except GSW)

2. Go onto gamedetail endpoint to get the exact player from team from game
http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2016/scores/gamedetail/0021600730_gamedetail.json
  - g->vls->pstg gives array of players (double check this not sure)

*/

var URLbase = "http://stats.nba.com/js/data/widgets/boxscore_breakdown_";
var URLbasePlayer = "http://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2016/scores/gamedetail/";

function getGame(URLx, team) {
  return axios.get(URLx).then((response) => {
    var games = response.data.results.filter((game) => {
      if (game.HomeTeam.triCode == team) {
        return true;
      } else if (game.VisitorTeam.triCode == team) {
        return true;
      } else {
        return false;
      }
    })

    if (games.length == 0) {
      return false;
    }
    return games;
  })
}

function promiseWhile(condition, action) {
  var resolver = Promise.defer();

  var loop = function() {
    if (!condition())
      return resolver.resolve();
    return Promise.cast(action()).then(loop).catch(resolver.reject);
  };

  process.nextTick(loop);
  return resolver.promise;
};

//format specifies if the startdate and enddate are Date type (false) or string (true) (Ex. 20170301)
function getPlayerStatsStartEnd(team, startDate, endDate, player, format) {

  var allStats = new Array();
  if (format) {
    var startYear = startDate.substring(0, 4);
    var startMonth = startDate.substring(4, 6);
    var startDay = startDate.substring(6, 8);

    var endYear = endDate.substring(0, 4);
    var endMonth = endDate.substring(4, 6);
    var endDay = endDate.substring(6, 8);

    var start = new Date(startMonth + "/" + startDay + "/" + startYear);
    var end = new Date(endMonth + "/" + endDay + "/" + endYear);
  } else {
    var start = startDate;
    var end = endDate;
  }
  console.log(start);
  console.log(end);
  console.log(start < end)
  return promiseWhile(function() {
    return start < end;
  }, function() {

    var dateStr = moment(start).format('YYYY/MM/DD');
    var formattedDate = dateStr.split("/").reduce((cur, value) => {
      return cur + value;
    })
    console.log(formattedDate)

    return getPlayerStats(team, formattedDate, player).then((response) => {
      if (!response) {} else {
        allStats.push(response[0]);
        console.log(allStats.length)
      }

      var newDate = start.setDate(start.getDate() + 1);
      start = new Date(newDate);
      return allStats;
    })
  }).then((response) => {
    //console.log(response)
    return allStats;
  })

}

function getPlayerStats(team, date, player) {
  //Date: year/month/day

  var URLComplete = URLbase + date + ".json";
  return getGame(URLComplete, team).then((game) => {

    if (!game) {
      return false;
    }

    var URLPlayerComplete = URLbasePlayer + game[0].GameID + "_gamedetail.json";
    console.log(URLPlayerComplete);
    return axios.get(URLPlayerComplete).then((response) => {

      var playerName = player.split("-");
      console.log("First Name: " + playerName[0]);
      console.log("Last Name: " + playerName[1]);
      console.log("Date: " + date);

      //away
      var filteredPlayerAway = response.data.g.vls.pstsg.filter((player) => {
        if (player.fn == playerName[0] && player.ln == playerName[1]) {
          return true;
        } else {
          return false;
        }
      })

      //home
      var filteredPlayerHome = response.data.g.hls.pstsg.filter((player) => {
        if (player.fn == playerName[0] && player.ln == playerName[1]) {
          return true;
        } else {
          return false;
        }
      })

      if (filteredPlayerHome.length > 0) {
        return filteredPlayerHome;
      } else {
        return filteredPlayerAway;
      }

    })

  })
}

function getSeasonStats(team, player) {
  var season = new Array();
  var counter = 0;

  //Sept 3rd
  var seasonStart = new Date("11/03/2016");
  var seasonEnd = new Date("04/10/2017");

  //console.log("test" + (seasonStart < seasonEnd))

  return promiseWhile(() => {
    return (seasonStart < seasonEnd)
  }, () => {
    var startdate = new Date(seasonStart);
    var enddate =  new Date(seasonStart);
    var newDate = enddate.setDate(enddate.getDate() + 7);
    enddate = new Date(newDate);



    return getPlayerStatsStartEnd(team, startdate, enddate, player).then((gamesArr) => {
      season[counter] = gamesArr;
      counter++;
      seasonStart = new Date(enddate);
      return season;
    })
  }).then( (response) => {
    return season;
  })

}

router.get("/playerdates/:team/:startdate/:enddate/:player", (req, res) => {
  getPlayerStatsStartEnd(req.params.team, req.params.startdate, req.params.enddate, req.params.player, true).then((response) => {
    res.json({"test": response});
  })
})

//example: localhost:8080/api/scoreboard/player/IND/20170301/Paul-George
router.get("/player/:team/:date/:player", (req, res) => {
  getPlayerStats(req.params.team, req.params.date, req.params.player).then((response) => {
    res.json({"test": response});
  })

})

router.get("/season/:team/:player", (req, res) => {
  getSeasonStats(req.params.team, req.params.player).then((response) => {
    res.json({"test" : response})
  })

})

module.exports = router
