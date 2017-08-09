const router = require('express').Router();
const axios = require('axios');
const Utils = require('./Utils');


// TODO: Use query builder here
var URL = "http://stats.nba.com/stats/leagueLeaders?LeagueID=00&PerMode=PerGame&Scope=S&Season=2016-17&SeasonType=Regular+Season&StatCategory=PTS";

router.get("/player/:player", (req,res) => {
  axios.get(URL)
  .then( (response) => {
    console.log(response);
    res.json({"test": response.data.resultSet.rowSet[0]})
  })
})


router.get("/team/:team", (req,res) => {
  axios.get(URL)
  .then( (response) => {

    var filtered = new Array();
    response.data.resultSet.rowSet.map((elem) => {
      if(elem[3] == req.params.team){
        filtered.push(elem);
      }
    })
    console.log(filtered.length);
    res.json({"test": Utils.formatJSONArray(response.data.resultSet.headers, filtered)});
  })
})

router.get("/average/:team", (req,res) => {
  axios.get(URL)
  .then( (response) => {

    var filtered = new Array();
    response.data.resultSet.rowSet.map((elem) => {
      if(elem[3] == req.params.team){
        filtered.push(elem);
      }
    })

    res.json({"test": Utils.statAverage(response.data.resultSet.headers, Utils.formatJSONArray(response.data.resultSet.headers, filtered))});
  })
})


module.exports = router;
