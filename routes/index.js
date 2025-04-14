const express = require('express');
const router = express.Router();

const Alpaca = require('../models/alpaca');
const alpaca = new Alpaca();

/* Home */
router.get('/', function(req, res) {
  res.render('Home');
});

/* Login */
router.get('/Login', function(req, res) {
  res.render('Login');
});

/* Stock Search Page */
router.get('/stock', (req, res) => {
  const symbol = req.query.symbol;
  res.render('stock', { stockSymbol: symbol });
});

/* Search form redirect */
router.get('/stock/search', (req, res) => {
  const symbol = req.query.symbol;
  if (symbol) {
    return res.redirect(`/stock/${symbol.toUpperCase()}`);
  }
  res.redirect('/stock');
});

/* Stock Details Page */
router.get('/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const stock = await alpaca.getStockDetails(symbol);

    if (!stock) return res.status(404).send('Stock not found');

    res.render('stock-details', {
      stockSymbol: symbol,
      companyName: stock.name,
      price: stock.price,
      changePercent: stock.changePercent,
      exchange: stock.exchange,
      assetClass: stock.assetClass,
    });
  } catch (err) {
    console.error('Error fetching stock data:', err.message);
    res.status(500).send('Error loading stock data');
  }
});

router.get('/portfolio', (req, res) => {
  res.render('portfolio'); 
});

module.exports = router;
