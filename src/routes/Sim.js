var schedule = [
  [
    [0, 1],
    [2, 3],
    [4, 5]
  ],
  [
    [0, 2],
    [3, 5],
    [4, 1]
  ],
  [
    [0, 3],
    [2, 4],
    [1, 5]
  ],
  [
    [0, 5],
    [2, 1],
    [3, 4]
  ],
  [
    [0, 4],
    [2, 5],
    [3, 1]
  ],
  //repeat
  [
    [0, 1],
    [2, 3],
    [4, 5]
  ],
  [
    [0, 2],
    [3, 5],
    [4, 1]
  ],
  [
    [0, 3],
    [2, 4],
    [1, 5]
  ],
  [
    [0, 5],
    [2, 1],
    [3, 4]
  ],
  [
    [0, 4],
    [2, 5],
    [3, 1]
  ],
  //repeat
  [
    [0, 1],
    [2, 3],
    [4, 5]
  ],
  [
    [0, 2],
    [3, 5],
    [4, 1]
  ],
  [
    [0, 3],
    [2, 4],
    [1, 5]
  ],
  [
    [0, 5],
    [2, 1],
    [3, 4]
  ],
  [
    [0, 4],
    [2, 5],
    [3, 1]
  ],
  //repeat
  [
    [0, 1],
    [2, 3],
    [4, 5]
  ],
  [
    [0, 2],
    [3, 5],
    [4, 1]
  ],
  [
    [0, 3],
    [2, 4],
    [1, 5]
  ],
  [
    [0, 5],
    [2, 1],
    [3, 4]
  ]
]

var teamA = ["Stephen-Curry", "Giannis-Antetokounmpo", "John-Wall", "DeAndre-Jordan", "Blake-Griffin"];
var teamB = ["James-Harden", "Paul-George", "Kyrie-Irving", "Paul-Millsap", "LaMarcus-Aldridge"];
var teamC = ["DeMarcus-Cousins", "Andre-Drummond", "Chris-Paul", "DeMar-DeRozan", "Andrew-Wiggins"]
var teamD = ["Kawhi-Leonard", "Karl!Anthony-Towns", "Klay-Thompson", "Mike-Conley", "Al-Horford"];
var teamE = ["Russell-Westbrook", "Kevin-Durant", "Draymond-Green", "Hassan-Whiteside", "CJ-Mccollum"];
var teamF = ["LeBron-James", "Damian-Lillard", "Anthony-Davis", "Carmelo-Anthony", "Jimmy-Butler"];

var team2A= ["Stephen-Curry", "Ricky-Rubio", "John-Wall", "Nicolas-Batum", "Marcin-Gortat", "Gorgui-Dieng", "Hassan-Whiteside", "Rudy-Gobert"];
var team2B= ["Damian-Lillard", "Jimmy-Butler", "Andrew-Wiggins", "LeBron-James", "Harrison-Barnes", "Anthony-Davis", "Aaron-Gordon", "Tristan-Thompson"];
var team2C= ["James-Harden", "CJ-McCollum", "Kyrie-Irving", "Paul-George", "Myles-Turner", "Julius-Randle", "Brook-Lopez", "Nikola-Vucevic"];
var team2D= ["Russell-Westbrook", "Devin-Booker", "Goran-Dragic", "Draymond-Green", "Tobias-Harris", "LaMarcus-Aldridge", "Andre-Drummond", "Jonas-Valanciunas"];
var team2E= ["Jeff-Teague", "Klay-Thompson", "Dennis-Schroder", "Giannis-Antetokounmpo", "Carmelo-Anthony", "Serge-Ibaka", "DeMarcus-Cousins", "Robin-Lopez"];
var team2F= ["Isaiah-Thomas", "DeMar-DeRozan", "Kemba-Walker", "Kawhi-Leonard", "Thaddeus-Young", "Dwight-Howard", "Karl!Anthony-Towns", "DeAndre-Jordan"];


var simulation = {
  schedule: schedule,
  teams: [team2A, team2B, team2C, team2D, team2E, team2F]
}

module.exports = simulation;

//WILL = 0;
//HIT(Hiten's Genius Team) = 1;
//JAS(I'm number 4) = 2;
//GUR(ChrisKamanHisPants) = 3;
//ZAR(Zaryan- DeMars Rover) = 4;
//HAR = 5;
