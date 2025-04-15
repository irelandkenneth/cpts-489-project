var express = require('express');
var router = express.Router()
const Alpaca = require('../models/alpaca')
const alpaca = new Alpaca()

router.get('/', async function (req, res) {

  // change to user's alpaca id when auth/login implemented
  const openPositionsList = await alpaca.listOpenPositions("68c43f83-af08-4cca-93d8-e0e6e18a8568")
  console.log(openPositionsList)

  const portfolioHistory = await alpaca.getPortfolioHistory("68c43f83-af08-4cca-93d8-e0e6e18a8568")

  const timestamps = portfolioHistory.timestamp
  var pacificTimestamps = []

  for (const timestamp of timestamps) {

    let date = new Date(timestamp * 1000); // convert to milliseconds

    let pacificTime = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      // year: "numeric",
      // month: "2-digit",
      // day: "2-digit",
      hour: "2-digit",
      // minute: "2-digit",
      // second: "2-digit",
      hour12: false
    }).format(date);

    pacificTimestamps.push(pacificTime)
  }

  console.log(portfolioHistory)
  res.render('portfolio', { openPositionsList,  portfolioHistory, pacificTimestamps});
});

module.exports = router