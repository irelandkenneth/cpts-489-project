var express = require('express');
var router = express.Router()
const Alpaca = require('../models/alpaca')
const alpaca = new Alpaca()
const users = require('../models/users')

const sessionChecker = (req, res, next)=>{
  if(req.session.user){
    res.locals.username = req.session.user.username
    next()
  }else{
    res.redirect("/login")
  }
}

router.use(sessionChecker)

router.get('/', async (req, res) => {

  const alpacaId = req.session.user.alpaca_id

  // change to user's alpaca id when auth/login implemented
  const openPositionsList = await alpaca.listOpenPositions(alpacaId)
  console.log(openPositionsList)

  const portfolioHistory = await alpaca.getPortfolioHistory(alpacaId)

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

router.post('/sell', (req, res) => {
  const { stockSymbol, quantity } = req.body
  const alpacaId = req.session.user.alpaca_id

  alpaca.createOrder(alpacaId, stockSymbol, quantity, null, "sell")

  res.redirect('/portfolio')

})

module.exports = router