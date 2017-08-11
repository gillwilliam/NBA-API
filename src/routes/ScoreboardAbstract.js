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

var URLbase = "http://stats.nba.com/stats/scoreboardV2?DayOffset=0&LeagueID=00&gameDate=";
var URLbasePlayer = "http://stats.nba.com/stats/boxscoretraditionalv2?EndPeriod=10&EndRange=28800&GameID=";

function getGame(URLx, team) {

    return axios.get(URLx).then((response) => {
    //console.log(response.data.resultSets[0].rowSet[0])
    var games = Utils.formatJSONArray(response.data.resultSets[0].headers, response.data.resultSets[0].rowSet)

    games = games.filter((game) => {
      var teamA = game.GAMECODE.substring(9,12);
      var teamB = game.GAMECODE.substring(12,15);

      //console.log(teamA);
      //console.log(teamA == team);
      //console.log(teamB == team)


      if(teamA == team || teamB == team){
        return true;
      }else{
        return false;
      }
    })

    if(games.length == 0){
      return false;
    }
    //console.log(games)

    return games[0].GAME_ID;
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
function getPlayerStats(team, dates, player) {
  //Date: year/month/day

  //11%2F06%2F2014
  var year = dates.substring(0, 4);
  var day = dates.substring(4, 6);
  var month = dates.substring(6, 8);
  var URLComplete = URLbase + day + "%2F" + month + "%2F" + year;
  console.log(URLComplete);
  return getGame(URLComplete, team).then((id) => {

    if (!id) {
      return false;
    }

    var URLPlayerComplete = URLbasePlayer + id + "&RangeType=0&Season=2016-17&SeasonType=Regular+Season&StartPeriod=1&StartRange=0";
    console.log(URLPlayerComplete);
    return axios.get(URLPlayerComplete).then((response) => {
      //console.log(response.data.resultSets[0].rowSet)
      var playerName = player.replace("-", " ");
    //  console.log("First Name: " + playerName);
    //  console.log("Date: " + dates);

      var players = Utils.formatJSONArray(response.data.resultSets[0].headers, response.data.resultSets[0].rowSet);

      //console.log(players[0])

      var filteredPlayers = players.filter((player) => {
        if(player.PLAYER_NAME == playerName){
          return true;
        }else{
          return false;
        }
      })
      console.log(filteredPlayers)
      return filteredPlayers;

    })

  })
}

function getSeasonStats(team, player) {
  var season = new Array();
  var counter = 0;

  //November 3rd
  var seasonStart = new Date("11/03/2016");
  var seasonEnd = new Date("12/03/2016");

  //console.log("test" + (seasonStart < seasonEnd))

  return promiseWhile(() => {
    return (seasonStart < seasonEnd)
  }, () => {
    var startdate = new Date(seasonStart);
    var enddate = new Date(seasonStart);
    var newDate = enddate.setDate(enddate.getDate() + 7);
    enddate = new Date(newDate);

    return getPlayerStatsStartEnd(team, startdate, enddate, player, false).then((gamesArr) => {
      season[counter] = gamesArr;
      counter++;
      seasonStart = new Date(enddate);
      return season;
    })
  }).then((response) => {
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
    res.json({"test": response})
  })
})

router.get("/test/:team/", (req, res) => {
  getGame(URLbase, req.params.team)
  .then( (response) => {
    res.json({"test" : response})
  })

})

router.get("/example", (req,res) => {
  axios.get("http://stats.nba.com/stats/scoreboardV2?DayOffset=0&LeagueID=00&gameDate=01%2F02%2F2017")
  .then((response) => {
    res.json({"test" : response.data})
  })
})

module.exports = router
