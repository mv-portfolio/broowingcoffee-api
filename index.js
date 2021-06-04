require('dotenv').config();

const cors = require('cors');
const Log = require('./src/utility/Log');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

//middlewares
const primary_auth_encoder = require('./src/middlewares/primary-auth-encoder');
const primary_auth_decoder = require('./src/middlewares/primary-auth-decoder');
const signin_auth_encoder = require('./src/middlewares/signin-auth-encoder');
const signin_auth_decoder = require('./src/middlewares/signin-auth-decoder');
const reset_password_encoder = require('./src/middlewares/reset-password-encoder');
const reset_password_decoder = require('./src/middlewares/reset-password-decoder');

//routes
const users = require('./src/routes/users');
const products = require('./src/routes/products');
const addons = require('./src/routes/add-ons');

const PORT = process.env.PORT;
const CONN = process.env.CONN_LOCAL;
const SECRET_KEY1 = process.env.SECRET_KEY1;

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(CONN, (err) => {
  if (err) return Log.show(err);
  Log.show('Successfully Connected MongoDB');
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());
app.use(`/${SECRET_KEY1}/app-authentication`, primary_auth_encoder);
app.use(`/${SECRET_KEY1}/signin-authentication-encoder`, primary_auth_decoder, signin_auth_encoder);
app.use(`/${SECRET_KEY1}/signin-authentication-decoder`, primary_auth_decoder, signin_auth_decoder);
app.use(`/${SECRET_KEY1}/user`, primary_auth_decoder, users);
app.use(`/${SECRET_KEY1}/products`, primary_auth_decoder, products);
app.use(`/${SECRET_KEY1}/add-ons`, primary_auth_decoder, addons);
app.use(`/${SECRET_KEY1}/reset-password/`, primary_auth_decoder, reset_password_encoder);

app.listen(PORT, () => {
  Log.show(`Listening PORT: ${PORT}`);
});
