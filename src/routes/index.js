const router = require('express').Router();
const axios = require('axios');
const Constants = require('./Constants');

const TeamPlayerDashboard = require('./TeamPlayerDashboard');
const LeagueLeaders = require('./LeagueLeaders');
const Scoreboard = require('./Scoreboard');
const ScoreboardAbstract = require('./ScoreboardAbstract');
const PlayerGameLogs = require('./PlayerGameLogs');


router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

router.use("/leagueleaders", LeagueLeaders);
router.use("/teamplayerdashboard", TeamPlayerDashboard);
router.use("/scoreboard", Scoreboard);
router.use("/scoreboardabstract", ScoreboardAbstract);
router.use("/playergamelogs", PlayerGameLogs);

axios.defaults.headers.common['Referer'] = "stats.nba.com/stats/";




module.exports = router;
