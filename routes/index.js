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
  res.render('Home', { user: req.session.user });
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
    ach_relationship_id: alpacaAccInfo.achRelationshipId,
    email: req.body.email,
    password: req.body.password,
    banned: 0,
    admin: 0
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
  if (user === null) {
    req.flash('error', 'Incorrect user credentials, please try again.');
    return res.redirect('/Login');
  }
  if (user.banned) {
    req.flash('error', 'You have been banned from VirtualMarket.');
    return res.redirect('/Login');
  }
  req.session.user = user;
  console.log("Logging in: ", req.session.user.email)
  return res.redirect('/');
})

router.post('/Login/Signout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

/* Stock Search Page */
router.get('/stock', async (req, res) => {
  const symbol = req.query.symbol;
  const popularSymbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'META', 'NFLX'];
  let popularStocks = [];

  try {
    for (const sym of popularSymbols) {
      const stock = await alpaca.getStockDetails(sym);
      if (stock) {
        popularStocks.push({
          symbol: sym,
          name: stock.name,
          price: stock.price,
          changePercent: stock.changePercent
        });
      }
    }

    res.render('stock', {
      stockSymbol: symbol,
      popularStocks
    });

  } catch (err) {
    console.error('Error fetching popular stock data:', err);
    res.render('stock', {
      stockSymbol: symbol,
      popularStocks: [],
      error: 'Unable to load popular stocks.'
    });
  }
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
      user: req.session.user
    });
  } catch (err) {
    console.error('Error fetching stock data:', err.message);
    res.status(500).send('Error loading stock data');
  }
});

router.post('/stock/*', async (req, res) => {
  const { stockSymbol, quantity } = req.body
  var alpacaId
  try {
    alpacaId = req.session.user.alpaca_id
  } catch (err) {
    console.error('Error buying stock:', err.message);
    res.status(500).send('Error buying stock.');
  }

  alpaca.createOrder(alpacaId, stockSymbol, quantity, null, "buy")
  res.redirect('/portfolio')
})

router.get('/admin', async (req, res) => {
  const query = req.query.q?.toLowerCase() || '';

  // Get all users within application
  var users = await Users.findUsers();
  if (users === null) {
    console.log('ERROR');
    return redirect('/admin')
  }

  var ports = [];
  for (user of users)
  {
    var portfolio = await alpaca.getPortfolioHistory(user.alpaca_id);
    if (portfolio === null) {
      console.log('ERROR');
    }

    ports.push({alpacaid: user.alpaca_id, portfolio: portfolio.equity.at(-1)})
  }

  res.locals.portfolios = ports;

  res.locals.users = users.filter(u =>
    u.email.toLowerCase().includes(query)
  );
  res.locals.query = query;
  return res.render('admin');
})

router.post('/admin/removeUser/:userId', async (req, res) => {
  const userId = req.params.userId;
  var deletedUser = await Users.removeUser(userId);
  if (deletedUser === null) {
    console.log('ERROR');
    return res.status(500).send('Error removing user');
  }
  console.log('This user is deleted:', deletedUser.email);
  return res.redirect('/admin');
})

router.post('/admin/toggleBan/:userId', async (req, res) => {
  const userId = req.params.userId;
  var bannedUser = await Users.toggleBan(userId);
  if (bannedUser === null) {
    console.log('ERROR');
    return res.status(500).send('Error toggling ban');
  }
  console.log('This user\'s ban has been altered:', bannedUser.email);
  return res.redirect('/admin');
})

router.post('/admin/toggleAdmin/:userId', async (req, res) => {
  const userId = req.params.userId;
  var adminUser = await Users.toggleAdmin(userId);
  if (adminUser === null) {
    console.log('ERROR');
    return res.status(500).send('Error toggling admin');
  }
  console.log('This user\'s admin status has been altered:', adminUser.email);
  return res.redirect('/admin');
})

router.post('/admin/depositCash/:userId', async (req, res) => {
  console.log("Here");
  const userId = req.params.userId;
  const depositAmount = req.body.depositAmount;

  var user = await Users.findOne({ where: { id: userId } });
  console.log(user);
  if (user === null) {
    console.log('ERROR');
    return res.status(500).send('Error finding user');
  }

  var transfer = await alpaca.requestNewTransfer(user.alpaca_id, user.ach_relationship_id, String(depositAmount));
  if (transfer === null) {
    console.log('ERROR');
    return res.status(500).send('Error depositing cash');
  }

  console.log('The user', user.email, 'was deposited', depositAmount);
  return res.redirect('/admin');
})

module.exports = router;
