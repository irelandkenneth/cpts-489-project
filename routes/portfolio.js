var express = require('express');
var router = express.Router()
const Alpaca = require('../models/alpaca')
const alpaca = new Alpaca()

router.get('/', async function (req, res) {

  // change to user's alpaca id when auth/login implemented
  const open_postions_list = await alpaca.listOpenPositions("68c43f83-af08-4cca-93d8-e0e6e18a8568")
  console.log(open_postions_list)
  res.render('portfolio', { open_postions_list });
});

module.exports = router