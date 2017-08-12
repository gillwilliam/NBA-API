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


var simulation = {
  schedule: schedule,
  teams: [teamA, teamB, teamC, teamD, teamE, teamF]
}

module.exports = simulation;

//WILL = 0;
//HIT(Hiten's Genius Team) = 1;
//JAS(I'm number 4) = 2;
//GUR(ChrisKamanHisPants) = 3;
//ZAR(Zaryan- DeMars Rover) = 4;
//HAR = 5;
