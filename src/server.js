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

    res.json({"test": filtered});
  })
})

app.listen(8080, function() {
    console.log("All right ! I am alive at Port 8080.");
});
