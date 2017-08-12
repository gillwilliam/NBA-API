const router = require('express').Router();
const axios = require('axios');
const Utils = require('./Utils');
const moment = require('moment');
const AllPlayers = require('./AllPlayers');
const Sim = require('./Sim');
const Promise = require('bluebird');

var URL = "http://stats.nba.com/stats/playergamelogs?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=Totals&Period=0&PlayerID=";

var SEASONDATES = {
  "2016-17": [
    "10/31/2016", "04/08/2017"
  ],
  "2015-16": ["11/01/2015", "04/01/2016"]
}

function getSeasonStatsPlayer(year, playerName) {
  var formattedPlayerName = (playerName).split("-");
  formattedPlayerName[0] = formattedPlayerName[0].replace("!", "-");

  formattedPlayerName = formattedPlayerName[1] + ", " + formattedPlayerName[0];

  console.log(formattedPlayerName);
  var playerInfo = AllPlayers.filter((player) => {
    return (player[1].toLowerCase() == formattedPlayerName.toLowerCase());
  })
  console.log(playerInfo);
  //201566
  var completeURL = URL + playerInfo[0][0] + "&PlusMinus=N&Rank=N&Season=" + year + "&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&VsConference=&VsDivision="

  console.log(completeURL);
  return axios.get(completeURL).then((response) => {
    //start oct 31st end april 8th
    //Season=2016-17
    //&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&VsConference=&VsDivision=

    var data = Utils.formatJSONArray(response.data.resultSets[0].headers, response.data.resultSets[0].rowSet);

    /*
       * TODO:
       * add all of the players to the data array and then sort the weeks
       */

    return data;
  })
}

function weeklify(data, year) {
  var seasonStart = new Date(SEASONDATES[year][0]);
  var seasonEnd = new Date(SEASONDATES[year][1]);
  var perWeekData = new Array();
  var counter = 0;

  while (seasonStart < seasonEnd) {
    var week = new Array();
    var enddate = new Date(seasonStart);
    var newDate = enddate.setDate(enddate.getDate() + 7);
    enddate = new Date(newDate);
    data.map((game) => {
      var tempDate = new Date(game.GAME_DATE);
      if (tempDate > seasonStart && tempDate < enddate) {
        week.push(game)
      }
    })
    perWeekData[counter] = week;
    seasonStart = new Date(enddate);
    counter++;
    console.log(counter)
  }

  return perWeekData;
}

function addAggregateElem(data) {

  data.map((week) => {

    var PTS = week.reduce((sum, value) => {
      return (sum + value["PTS"])
    }, 0)

    var REB = week.reduce((sum, value) => {
      return (sum + value["REB"])
    }, 0)

    var FG_PCT = week.reduce((sum, value) => {
      return (sum + value["FG_PCT"])
    }, 0) / week.length;

    var FG3M = week.reduce((sum, value) => {
      return (sum + value["FG3M"])
    }, 0);

    var STL = week.reduce((sum, value) => {
      return (sum + value["STL"])
    }, 0);

    var BLK = week.reduce((sum, value) => {
      return (sum + value["BLK"])
    }, 0);

    var TOV = week.reduce((sum, value) => {
      return (sum + value["TOV"])
    }, 0);

    var AST = week.reduce((sum, value) => {
      return (sum + value["AST"])
    }, 0);

    var FT_PCT = week.reduce((sum, value) => {
      return (sum + value["FT_PCT"])
    }, 0) / week.length;

    week.unshift({
      "PTS": PTS,
      "REB": REB,
      "FG_PCT": FG_PCT,
      "FG3M": FG3M,
      "STL": STL,
      "BLK": BLK,
      "TOV": TOV,
      "AST": AST,
      "FT_PCT": FT_PCT
    });
  })
  return data;

}

function onlyAggregate(data){

  var agg = new Array();

  data.map((week) => {

    var PTS = week.reduce((sum, value) => {
      return (sum + value["PTS"])
    }, 0)

    var REB = week.reduce((sum, value) => {
      return (sum + value["REB"])
    }, 0)

    var FG_PCT = week.reduce((sum, value) => {
      return (sum + value["FG_PCT"])
    }, 0) / week.length;

    var FG3M = week.reduce((sum, value) => {
      return (sum + value["FG3M"])
    }, 0);

    var STL = week.reduce((sum, value) => {
      return (sum + value["STL"])
    }, 0);

    var BLK = week.reduce((sum, value) => {
      return (sum + value["BLK"])
    }, 0);

    var TOV = week.reduce((sum, value) => {
      return (sum + value["TOV"])
    }, 0);

    var AST = week.reduce((sum, value) => {
      return (sum + value["AST"])
    }, 0);

    var FT_PCT = week.reduce((sum, value) => {
      return (sum + value["FT_PCT"])
    }, 0) / week.length;

    agg.push({
      "PTS": PTS,
      "REB": REB,
      "FG_PCT": FG_PCT,
      "FG3M": FG3M,
      "STL": STL,
      "BLK": BLK,
      "TOV": TOV,
      "AST": AST,
      "FT_PCT": FT_PCT
    });
  })
  return agg;
}

router.get("/getSeasonStats/:year/:playerName", (req, res) => {
  getSeasonStatsPlayer(req.params.year, req.params.playerName).then((perWeekData) => {
    res.json({"test": perWeekData})
  })

})

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

function teamStats(team, year) {

  var counter = 0;
  var length = team.length;

  var allData = new Array();

  return promiseWhile(function() {
    return counter < length;
  }, function() {

    return getSeasonStatsPlayer(year, team[counter]).then((response) => {
      allData.push(response);
      counter++;
    });
  }).then((response) => {
    //console.log(response)
    var simplifiedData = allData.reduce((sum, value) => {
      return sum.concat(value)
    });
    return weeklify(simplifiedData, year);
  })
}

router.get("/getExampleTeam", (req, res) => {

  var year = "2016-17";
  var team = ["Paul-George", "LeBron-James"];
  teamStats(team, year).then((response) => {
    res.json({test: addAggregateElem(response)})
  })

})

router.get("/aggExampleTeam", (req, res) => {
  console.log(Sim.sched);
  var year = "2016-17";
  //var team = ["Paul-George", "LeBron-James"];
  var team = Sim.teams[2];
  teamStats(team, year).then((response) => {
    res.json({test: onlyAggregate(response)})
  })

})

function runSimulation(){
  var allTeamsStats = new Array();

  var counter = 0;
  var length = Sim.teams.length;
  var year = "2016-17";
  return promiseWhile(function() {
    return counter < length;
  }, function() {

    return teamStats(Sim.teams[counter], year).then((response) => {
      allTeamsStats[counter] = onlyAggregate(response);
      counter++;
    });
  }).then((response) => {

    var separated = new Array();

    var numWeeks = allTeamsStats[0].length;

    for(var i = 0; i < numWeeks; i++){
      var temp = new Array();
      for(var k = 0; k < length; k++){
        temp[k] = allTeamsStats[k][i];
      }
      separated[i] = temp;
    }


    return separated;
  })

}

router.get("/runsim", (req, res) => {
  runSimulation().then((response) => {
    res.json({test: response})
  })
})

module.exports = router;
