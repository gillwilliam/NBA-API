const router = require('express').Router();
const axios = require('axios');
const Utils = require('./Utils');


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

function getGame (URLx, team) {
  return axios.get(URLx)
  .then( (response) => {
    var games = response.data.results.filter((game) => {
      if(game.HomeTeam.triCode == team){
        return true;
      }else if(game.VisitorTeam.triCode == team){
        return true;
      }else{
        return false;
      }
    })

    if(games.length == 0){
      return false;
    }
    return games;
  })
}

function getPlayerStats(team, date, player){
    //Date: year/month/day

    var URLComplete = URLbase + date + ".json";
    return getGame(URLComplete, team).then((game) => {

      if(!game){
        return "No game found";
      }

      var URLPlayerComplete = URLbasePlayer + game[0].GameID + "_gamedetail.json";
      console.log(URLPlayerComplete);
      return axios.get(URLPlayerComplete)
      .then( (response) => {

        var playerName = player.split("-");
        console.log("First Name: " + playerName[0]);
        console.log("Last Name: " + playerName[1]);
        console.log("Date: " + date);

        //away
        var filteredPlayerAway = response.data.g.vls.pstsg.filter( (player) => {
          if(player.fn == playerName[0] && player.ln == playerName[1]){
            return true;
          }else{
            return false;
          }
        })

        //home
        var filteredPlayerHome = response.data.g.hls.pstsg.filter( (player) => {
          if(player.fn == playerName[0] && player.ln == playerName[1]){
            return true;
          }else{
            return false;
          }
        })

        if(filteredPlayerHome.length > 0){
          return filteredPlayerHome;
        }else{
          return filteredPlayerAway;
        }

      })

    })
}

//example: localhost:8080/api/scoreboard/player/IND/20170301/Paul-George
router.get("/player/:team/:date/:player", (req, res) => {
  getPlayerStats(req.params.team, req.params.date, req.params.player).then( (response) => {
    res.json({"test": response});
  })

})

router.get("/games/:team", (req,res) => {
  getGame(URL, req.params.team).then((response) => {
    res.json({"test": response})
  })
})

module.exports = router
