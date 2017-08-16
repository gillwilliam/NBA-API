const router = require('express').Router();
const axios = require('axios');
const Utils = require('./Utils');
const moment = require('moment');
const AllPlayers = require('./AllPlayers');
const Sim = require('./Sim');
const Promise = require('bluebird');
const fs = require('fs');

const archivedData = require('../sampleSim.js');
const newArchivedData = require('../SimData.js');

var URL = "http://stats.nba.com/stats/playergamelogs?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=Totals&Period=0&PlayerID=";

//Start and end dates of the season
var SEASONDATES = {
  "2016-17": [
    "10/31/2016", "04/08/2017"
  ],
  "2015-16": ["11/01/2015", "04/01/2016"]
}

/*
* getSeasonStatsPlayer(year, playerName) produces the season (year) stats
*     for playerName
* getSeasonStatsPlayer: String String -> JSON
* Examples:
* getSeasonStatsPlayer("2015-16", "LeBron-James")
* getSeasonStatsPlayer("2016-17", "Kevin-Durant")
*/
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

    var data = Utils.formatJSONArray(response.data.resultSets[0].headers, response.data.resultSets[0].rowSet);

    return data;
  })
}

/*
* weeklify(data, year) produces a list of the player data by week
*   in ascending order
* weeklify: JSON String -> JSON
* Helper function for getSeasonStatsPlayer() as used in teamStats()
*/
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

/*
* addAggregateElem(data) adds an element to each week of (season) data that
*   aggregates the stats of ALL players that week
* addAggregateElem: JSON -> JSON
* function to be used in conjunction with getSeasonStatsPlayer() -> weeklify()
* Currently UNUSED
*/
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

/*
* onlyAggregate(data) produces a list each week of (season) data that only
*   contains the aggregate stats of that week for ALL players on team
* onlyAggregate: JSON -> JSON
* function to be used in conjunction with getSeasonStatsPlayer() -> weeklify()
*/
function onlyAggregate(data) {

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

/*
* onlyAggregateTeamSim() produces a list of the aggregated stats by week for all
*    teams in the simulation (pulled from Sim.js)
* onlyAggregateTeamSim: Blank -> JSON
* Options:
*   To change the players in team, change the player names in Sim.js
*   Following a sample simulation schedule (Sim.schedule)
* TODO:
*   Have year as a parameter
*   Have it pull from "player archive"
*/
function onlyAggregateTeamSim() {
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

    for (var i = 0; i < numWeeks; i++) {
      var temp = new Array();
      for (var k = 0; k < length; k++) {
        temp[k] = allTeamsStats[k][i];
      }
      separated[i] = temp;
    }

    return separated;
  })

}

/*
* whoWon(weekData, players) produces a list of the categories that each player
*   won for that week against their opponent
* whoWon: JSON [String] -> JSON
*/

function whoWon(weekData, players) {

  var result = new Array();

  players.map((game) => {
    result[game[0]] = compare(game[0], game[1], weekData);
  })
  players.map((game) => {
    result[game[1]] = compare(game[1], game[0], weekData);
  })
  return result;
}

/*
* compare(playerA, playerB, data) produces a list of the categories that playerA
*   won vs playerB based on data
* compare: Int Int JSON -> JSON
*/
function compare(playerA, playerB, data) {
  var counter = 0;
  var cats = [
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
  var filtered = cats.filter((cat) => {
    //console.log(playerA);
    return (data[playerA][cat] < data[playerB][cat])
  })

  return filtered
}

/*
* runSimWithCats() runs the simulation of the full season returning the
*   categories that each person won per week
* compare: blank -> JSON
* OFFLINE DATA (newArchivedData)
* stats.nba.com throttles requests after some time
*/
function runSimWithCats() {
  var players = Sim.schedule;
  var fullSeason = new Array();
  //slice is for the weeks that are considered
  newArchivedData.slice(0, players.length).map((weekData, index) => {
    fullSeason[index] = whoWon(weekData, players[index])
  })
  return fullSeason;
}

/*
* runSim() runs the simulation of the full season returning the resulting
*   record of each player
* compare: blank -> JSON
* OFFLINE DATA (newArchivedData)
* stats.nba.com throttles requests after some time
*/
function runSim() {
  var players = Sim.schedule;
  var fullSeason = new Array();
  var data = runSimWithCats();
  data.map((weekData, index) => {
    fullSeason[index] = whoWonRecord(weekData, players[index])
  })
  return fullSeason;
}

/*
* whoWonRecord(weekData, players) returns 0 (loss), 1 (tie), 2 (win) for each
*   player for that week
* whoWonRecord: JSON [String] -> JSON
*/
function whoWonRecord(weekData, players) {

  var result = new Array();

  players.map((game) => {
    result[game[0]] = compareRecord(game[0], game[1], weekData);
  })
  players.map((game) => {
    result[game[1]] = compareRecord(game[1], game[0], weekData);
  })
  return result;
}

/*
* compareRecord(playerA, playerB, data) returns 0 (loss), 1 (tie), 2 (win) that
*   playerA won vs playerB based on data
* compare: Int Int JSON -> JSON
*/
function compareRecord(playerA, playerB, data) {
  if (data[playerA].length < data[playerB].length) {
    return 0
  } else if (data[playerA].length == data[playerB].length) {
    return 1;
  } else {
    return 2;
  }
}

/*
* whoWonRecord(weekData, players) a aggregated record for each player for
*   their performance over the season
* whoWonRecord: blank -> JSON
*/
function finalRecord() {
  var teams = new Array();

  var rawData = runSim();
  for (var i = 0; i < 6; i++) {
    var record = [0, 0, 0];
    rawData.map((week) => {
      record[week[i]] = record[week[i]] + 1;
    })
    teams[i] = record;
  }
  return teams;
}

/*
* promiseWhile(condition, action) produces the template of a while loop, but
*   waits for the action to finish before moving on to next loop
* promiseWhile: Bool Promise -> Promise
* TODO: Move to Utils
*/
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

/*
* teamStats(team, year) produces weekly stats of a team
* teamStats: [String] String -> JSON
* Examples:
* teamStats(["Paul-George", "LeBron-James", "Kevin-Durant"], "2016-17")
* teamStats(["Kyrie-Irving", "LeBron-James"], "2015-16")
*/
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

router.get("/getSeasonStats/:year/:playerName", (req, res) => {
  getSeasonStatsPlayer(req.params.year, req.params.playerName).then((perWeekData) => {
    res.json({"test": perWeekData})
  })

})

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

router.get("/runsimcats", (req, res) => {
  // onlyAggregateTeamSim().then((response) => {
  //   res.json({test: response})
  // })
  var seasonWithCats = runSimWithCats();

  res.json({test: seasonWithCats})
})

router.get("/runsim", (req, res) => {
  // onlyAggregateTeamSim().then((response) => {
  //   fs.writeFile('simdata.txt', JSON.stringify(response), function (err) {
  //
  //   });
  //   res.json({test: response})
  // })
  var seasonRecord = finalRecord()

  res.json({test: seasonRecord})
})

module.exports = router;
