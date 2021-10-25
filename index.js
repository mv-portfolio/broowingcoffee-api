require('dotenv').config();

const cors = require('cors');
const Log = require('./src/utility/Log');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

//utils
const Cache = require('./src/utility/Cache');

//middlewares
const auth_guard = require('./src/middlewares/auth-guard');
const route_guard = require('./src/middlewares/route-guard');
const reset_guard = require('./src/middlewares/reset-guard');
const receipt_guard = require('./src/middlewares/receipt-guard');
const primary_auth_encoder = require('./src/middlewares/primary-auth-encoder');
const primary_auth_decoder = require('./src/middlewares/primary-auth-decoder');
const signin_auth_encoder = require('./src/middlewares/signin-auth-encoder');
const signin_auth_decoder = require('./src/middlewares/signin-auth-decoder');
const reset_password_encoder = require('./src/middlewares/reset-password-encoder');
const reset_password_decoder = require('./src/middlewares/reset-password-decoder');
const reset_password_auth = require('./src/middlewares/reset-password-auth');
const transaction_receipt = require('./src/middlewares/transaction-receipt');

//routes
const users = require('./src/routes/users');
const products = require('./src/routes/products/main');
const addons = require('./src/routes/products/add-ons');
const transactions = require('./src/routes/transaction');
const inventory = require('./src/routes/inventory');

const {PORT, DATABASE, CLIENT} = process.env;

mongoose.set('runValidators', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(DATABASE, err => {
  if (err) return Log.show(err);
  Log.show('Successfully Connected MongoDB');
});

app.locals = {
  tokenUsed: new Cache(),
};

setInterval(() => {
  app.locals.tokenUsed.popAllUsedTokens();
}, 1000 * 60 * 60);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(
  cors({
    origin: [
      CLIENT,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://192.168.43.67:3000',
      'http://192.168.43.67:3001',
    ],
  }),
);
app.use(
  `/:secret_key1/api/service/app-authentication`,
  route_guard,
  primary_auth_encoder,
);
app.use(
  `/:secret_key1/api/service/signin-authentication-encoder`,
  route_guard,
  primary_auth_decoder,
  signin_auth_encoder,
);
app.use(
  `/:secret_key1/api/service/signin-authentication-decoder`,
  route_guard,
  primary_auth_decoder,
  signin_auth_decoder,
);
app.use(
  `/:secret_key1/api/service/users`,
  route_guard,
  auth_guard,
  primary_auth_decoder,
  users,
);
app.use(
  `/:secret_key1/api/service/products/main`,
  route_guard,
  auth_guard,
  primary_auth_decoder,
  products,
);
app.use(
  `/:secret_key1/api/service/products/addons`,
  route_guard,
  auth_guard,
  primary_auth_decoder,
  addons,
);
//reset-password
app.use(
  `/:secret_key1/api/service/reset-password-encoder/`,
  route_guard,
  primary_auth_decoder,
  reset_password_encoder,
);
app.use(
  `/:secret_key1/api/service/reset-password-auth`,
  route_guard,
  reset_guard,
  reset_password_auth,
);
app.use(
  `/:secret_key1/api/service/reset-password-decoder`,
  route_guard,
  reset_guard,
  reset_password_decoder,
);
//transaction
app.use(
  `/:secret_key1/api/service/transactions`,
  route_guard,
  auth_guard,
  primary_auth_decoder,
  transactions,
);
app.use(
  `/:secret_key1/api/service/transaction-receipt`,
  route_guard,
  receipt_guard,
  transaction_receipt,
);
//inventory
app.use(
  `/:secret_key1/api/service/inventory`,
  auth_guard,
  route_guard,
  primary_auth_decoder,
  inventory,
);

app.use('*', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  Log.show(`Listening PORT: ${PORT}`);
});
