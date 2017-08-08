const router = require('express').Router();
const axios = require('axios');
const TeamPlayerDashboard = require('./TeamPlayerDashboard');


const LeagueLeaders = require('./LeagueLeaders');


router.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

router.use("/leagueleaders", LeagueLeaders);
router.use("/teamplayerdashboard", TeamPlayerDashboard);




module.exports = router;
