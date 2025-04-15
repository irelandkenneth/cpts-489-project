const express = require('express');
const router = express.Router();

const Alpaca = require('../models/alpaca');
const alpaca = new Alpaca();

const sequelize = require('../db');
const Users = require('../models/users');

/* Home */
router.get('/', function(req, res) {
  if (req.session.user) {
    console.log(req.session.user.email, '-',)
  }
  res.render('Home', { user: req.session.user});
});

/* Create Account */
router.get('/CreateAccount', (req, res) => {
  res.render('CreateAccount');
});


router.post('/CreateAccount/NewAccount', async (req, res) => {
  // Check if user exists
  const possibleUser = await Users.findOne({ where: { email: req.body.email } });
  console.log("Checking if user", req.body.email, "exists...")
  if (possibleUser != null && possibleUser.email != null)
  {
    console.log('Account with the email ' + possibleUser.email + ' already exists. Redirecting...');
    req.flash('error', 'Account with the email ' + possibleUser.email + ' already exists.');
    return res.redirect('/CreateAccount');
  }

  // Create new alpaca account
  console.log("Creating new account with alpaca...");
  const alpacaAccInfo = await alpaca.createAccount();
  console.log("Account created with id:", alpacaAccInfo.accountId, "and achRelationshipId:", alpacaAccInfo.achRelationshipId);

  // Create application account with alpaca account id
  console.log("Creating new user in database...");
  const user = await Users.create({
    alpaca_id: alpacaAccInfo.accountId,
    email: req.body.email,
    password: req.body.password,
  });
  console.log("User created with id:", user.id);

  req.session.user = user;
  return res.redirect('/');  
});

/* Login */
router.get('/Login', function(req, res) {
  res.render('Login');
});

/* Signin */
router.post('/Login/Signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findUser(email, password);
  if (user !== null) {
    req.session.user = user;
    console.log("Logging in: ", req.session.user.email)
    res.redirect('/');
  }
})

router.post('/Login/Signout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

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

module.exports = router;
