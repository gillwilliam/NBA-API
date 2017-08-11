const router = require('express').Router();
const axios = require('axios');
const Utils = require('./Utils');
const moment = require('moment');
const AllPlayers = require('./AllPlayers');
const Promise = require('bluebird');


var URL = "http://stats.nba.com/stats/playergamelogs?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=Totals&Period=0&PlayerID=";

var SEASONDATES = {
  "2016-17": ["10/31/2016", "04/08/2017"],
  "2015-16": ["11/01/2015", "04/01/2016"]
}

function getSeasonStatsPlayer(year, playerName) {
  var formattedPlayerName = (playerName).split("-");
  formattedPlayerName = formattedPlayerName[1] + ", " + formattedPlayerName[0];

  console.log(formattedPlayerName);
  var playerInfo = AllPlayers.filter((player) => {
    return (player[1].toLowerCase() == formattedPlayerName.toLowerCase());
  })
  console.log(playerInfo);
  //201566
  var completeURL = URL + playerInfo[0][0] + "&PlusMinus=N&Rank=N&Season=" + year + "&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&VsConference=&VsDivision="

  console.log(completeURL);
  return axios.get(completeURL)
    .then((response) => {
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

function weeklify(data, year){
  var seasonStart = new Date(SEASONDATES[year][0]);
  var seasonEnd = new Date(SEASONDATES[year][1]);
  var perWeekData = {};
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
    perWeekData["week" + counter] = week;
    seasonStart = new Date(enddate);
    counter++;
    console.log(counter)
  }

  return perWeekData
}


router.get("/getSeasonStats/:year/:playerName", (req, res) => {
  getSeasonStatsPlayer(req.params.year, req.params.playerName).then((perWeekData) => {
    res.json({
      "test": perWeekData
    })
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

function teamStats(team){

  var counter = 0;
  var length = team.length;

  var allData = new Array();

  return promiseWhile(function() {
    return counter < length;
  }, function() {

    return getSeasonStatsPlayer("2016-17", team[counter]).then((response) => {
      allData.push(response);
      counter++;
    });
  }).then((response) => {
    //console.log(response)
    var simplifiedData = allData.reduce((sum, value)=>{
      return sum.concat(value)
    });
    return weeklify(simplifiedData, "2016-17");
  })
}

router.get("/getExampleTeam", (req, res) => {

  var team = ["Paul-George", "LeBron-James"];
  teamStats(team).then( (response) => {
    res.json({test: response})
  })

})




module.exports = router;
