require('dotenv').config();

const cors = require('cors');
const Log = require('./src/utility/Log');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

//middlewares
const auth_guard = require('./src/middlewares/auth-guard');
const route_guard = require('./src/middlewares/route-guard');
const primary_auth_encoder = require('./src/middlewares/primary-auth-encoder');
const primary_auth_decoder = require('./src/middlewares/primary-auth-decoder');
const signin_auth_encoder = require('./src/middlewares/signin-auth-encoder');
const signin_auth_decoder = require('./src/middlewares/signin-auth-decoder');
const reset_password_encoder = require('./src/middlewares/reset-password-encoder');
const reset_password_decoder = require('./src/middlewares/reset-password-decoder');

//routes
const users = require('./src/routes/users');
const products = require('./src/routes/products/main');
const addons = require('./src/routes/products/add-ons');

const {PORT, CONN_LOCAL} = process.env;

mongoose.set('runValidators', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(CONN_LOCAL, err => {
  if (err) return Log.show(err);
  Log.show('Successfully Connected MongoDB');
});

// app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());
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
app.use(
  `/:secret_key1/api/service/reset-password/`,
  route_guard,
  primary_auth_decoder,
  reset_password_encoder,
);

app.listen(PORT, () => {
  Log.show(`Listening PORT: ${PORT}`);
});
