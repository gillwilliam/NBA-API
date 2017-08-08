const axios = require('axios');
const Utils = require('./Utils');
const router = require('express').Router();

var URL = "http://stats.nba.com/stats/teamplayerdashboard?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlusMinus=N&Rank=N&Season=2016-17&SeasonSegment=&SeasonType=Regular+Season&TeamId=1610612760&VsConference=&VsDivision=";

router.get("/team", (req, res) => {
  axios.get(URL)
  .then( (response) => {
    console.log(response);
    res.json({"test": Utils.formatJSONArray(response.data.resultSets[0].headers,response.data.resultSets[0].rowSet)})
  })
})

router.get("/players", (req, res) => {
  axios.get(URL)
  .then( (response) => {
    var data = response.data.resultSets[1].rowSet;
    var headers = response.data.resultSets[1].headers;

    res.json({"test": Utils.formatJSONArray(headers, data)});
  })
})

module.exports = router;
