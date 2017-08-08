
function formatJSONPlayer (headers, playerx) {
  var Player = {};
  headers.map((title, index) => {
    Player[title] = playerx[index];
  })

  return Player;
}


module.exports = {

formatJSONArray: function (headers, playersx){

  var Players = [];
  playersx.map((player) => {
    Players.push(formatJSONPlayer(headers,player));
  })

  return Players;
},

formatJSONPlayer: function (headers, playerx) {
  var Player = {};
  headers.map((title, index) => {
    Player[title] = playerx[index];
  })

  return Player;
},

statAverage: function (headers, playersx) {

  var Averages = {};
  var notNums=["PLAYER_ID","PLAYER", "TEAM"];
  console.log(playersx[0].MIN);
  headers.map( (title) => {
    if(notNums.indexOf(title) == -1){
    var unrounded = playersx.reduce((sum, value) => {
      return sum + value[title];
    }, 0) / playersx.length;

    Averages[title] = Math.round(unrounded*1000)/1000;
  }
  })

  return Averages;

}

}
