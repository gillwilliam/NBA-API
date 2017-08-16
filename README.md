# NBA-API
An API for handling stats from stats.nba.com

## Simulation:
- Create x random players
  - Have them pick the next "best" player
  - Have one player follow the strategy
- Use create matchups for every week
- using API run through the weeks and determine how the players did

### Current Strategy:
- find players with the highest stdev away for the non-punted stats

Tools used:
- bluebird
- moment
- express
- axios

## Current Routes:

PlayerGameLogs:
- /runsim runs the simulation of a sample (fantasy) season with 6 players (x number of players on each team)
- /getExampleTeam will get the stats of each game for a team

LeagueLeaders:
- /leagueleaders/team/:team find league leaders by team
- /leagueleaders/average/:team will get the average of the leagueleaders by team

TeamPlayerDashboard:
- /teamplayerdashboard/team/ gives stats of the whole team
- /teamplayerdashboard/players/ gives stats of all players on team

Scoreboard:
- /scoreboard/playerdates/:team/:startdate/:enddate/:player gives the stats of a player for each game in a given set of dates
- /player/:team/:date/:player gives the stats of an individual game

ScoreboardAbstract (for getting older stats):
- /playerdates/:team/:startdate/:enddate/:player gives the stats of a player between the start and end dates
- /player/:team/:date/:player gives the stats of a player on a specific date
- /season/:team/:player gets the full season stats for the player

## TODO:
### General
- Add a route for getting an array with many seasons of the player or team (arbitrary number?)
- Add more aggregation stats
- Add playoff vs regular season params
- array of one stat over the years
- compare "eras"
- Add fantasy specific things
  - Have a way to incorporate my league and team
- View trends over the season of a specific stat (or stats)
