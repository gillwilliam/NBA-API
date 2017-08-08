const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');


var app = express();
var router = express.Router();
app.use("/api", router);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


router.get("/", (req, res) => {
  res.json({"Message": "Hello World"});
})

router.get("/nba", (req, res) => {
  axios.get("http://stats.nba.com/stats/leagueLeaders?LeagueID=00&PerMode=PerGame&Scope=S&Season=2016-17&SeasonType=Regular+Season&StatCategory=PTS")
  .then( (response) => {
    console.log(response);
    res.json({"test": response.data})
  })
})

router.get("/nba/:player", (req,res) => {
  axios.get("http://stats.nba.com/stats/leagueLeaders?LeagueID=00&PerMode=PerGame&Scope=S&Season=2016-17&SeasonType=Regular+Season&StatCategory=PTS")
  .then( (response) => {
    console.log(response);
    res.json({"test": response.data.resultSet.rowSet[0]})
  })
})


router.get("/nbateam/:team", (req,res) => {
  axios.get("http://stats.nba.com/stats/leagueLeaders?LeagueID=00&PerMode=PerGame&Scope=S&Season=2016-17&SeasonType=Regular+Season&StatCategory=PTS")
  .then( (response) => {

    var filtered = new Array();
    response.data.resultSet.rowSet.map((elem) => {
      if(elem[3] == req.params.team){
        filtered.push(elem);
      }
    })

    res.json({"test": formatJSONArray(response.data.resultSet.headers, filtered)});
  })
})

router.get("/average/:team", (req,res) => {
  axios.get("http://stats.nba.com/stats/leagueLeaders?LeagueID=00&PerMode=PerGame&Scope=S&Season=2016-17&SeasonType=Regular+Season&StatCategory=PTS")
  .then( (response) => {

    var filtered = new Array();
    response.data.resultSet.rowSet.map((elem) => {
      if(elem[3] == req.params.team){
        filtered.push(elem);
      }
    })

    res.json({"test": statAverage(response.data.resultSet.headers, formatJSONArray(response.data.resultSet.headers, filtered))});
  })
})

function statAverage (headers, playersx) {

  var Averages = {};
  var notNums=["PLAYER_ID","PLAYER", "TEAM"];
  console.log(playersx[0].MIN);
  headers.map( (title) => {
    if(notNums.indexOf(title) == -1){
    var unrounded = playersx.reduce((sum, value) => {
      return sum + value[title];
    }, 0) / playersx.length;

    console.log("test" + unrounded);
    Averages[title] = Math.round(unrounded*1000)/1000;
    console.log("test2" + (Math.round(unrounded*1000)/1000));
  }
  })

  return Averages;

}

function formatJSONArray(headers, playersx){

  var Players = [];
  playersx.map((player) => {
    Players.push(formatJSONPlayer(headers,player));
  })

  return Players;
}

function formatJSONPlayer (headers, playerx) {
  var Player = {};
  headers.map((title, index) => {
    Player[title] = playerx[index];
  })

  return Player;

  // body...
}

app.listen(8080, function() {
    console.log("All right ! I am alive at Port 8080.");
});
