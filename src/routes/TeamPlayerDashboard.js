const axios = require('axios');
const Utils = require('./Utils');
const router = require('express').Router();
const Constants = require('./Constants');


var URL = "http://stats.nba.com/stats/teamplayerdashboard?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlusMinus=N&Rank=N&Season=2016-17&SeasonSegment=&SeasonType=Regular+Season&TeamId=1610612760&VsConference=&VsDivision=";

var baseURL = "http://stats.nba.com/stats/teamplayerdashboard?"
var params = ["DateFrom", "DateTo", "GameSegment", "LastNGames", "LeagueID", "Location", "MeasureType", "Month", "OpponentTeamID", "Outcome", "PORound", "PaceAdjust", "PerMode", "Period", "PlusMinus", "Rank", "Season", "SeasonSegment", "SeasonType", "TeamId", "VsConference", "VsDivision"];
var values = ["", "", "", "0", "00", "", "Base", "0", "0", "", "0", "N", "PerGame", "0", "N", "N", "2016-17", "", "Regular+Season", "1610612760", "", ""];


//to make general use Constants.TEAMS.(teamname) as a param in URL
router.get("/team/:team", (req, res) => {

  var team = req.params.team;
  var TeamId = Constants.TEAMS[team].id;

  values[19] = TeamId;
  var URLA = Utils.queryBuilder(baseURL, params, values);
  console.log(URLA);

  axios.get(URLA)
  .then( (response) => {
    res.json({"test": Utils.formatJSONArray(response.data.resultSets[0].headers,response.data.resultSets[0].rowSet)})
  })
})

router.get("/players/:team", (req, res) => {

  var team = req.params.team;
  var TeamId = Constants.TEAMS[team].id;

  values[19] = TeamId;
  var URLA = Utils.queryBuilder(baseURL, params, values);

  axios.get(URLA)
  .then( (response) => {
    var data = response.data.resultSets[1].rowSet;
    var headers = response.data.resultSets[1].headers;

    res.json({"test": Utils.formatJSONArray(headers, data)});
  })
})

module.exports = router;
