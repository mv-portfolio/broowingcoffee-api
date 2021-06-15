const Log = require('../utility/Log');
const Thread = require('../utility/Thread');
const Token = require('../utility/Token');
const mongoose = require('mongoose');
const Informations = require('../schemas/users/informations');
const Accounts = require('../schemas/users/accounts');
const Configs = require('../schemas/users/configs');
const Products = require('../schemas/products');
const Addons = require('../schemas/add-ons');

const SECRET_KEY2 = process.env.SECRET_KEY2;

const onHandleError = err => {
  let message = '';
  let errors = {firstname: '', lastname: '', username: '', email: '', name: ''};

  if (err.message.includes('validation failed')) {
    Object.values(err.errors).map(({properties}) => {
      errors[properties.path] = properties.message;
    });
  }

  if (err.message.includes('11000')) {
    if (err.message.includes('username')) {
      errors.username = 'Username is already in used.';
    }
    if (err.message.includes('email')) {
      errors.email = 'Email is already in used.';
    }
    if (err.message.includes('name')) {
      errors.name = 'Name is already exist';
    }
  }

  if (err.message.length !== 0) {
    message = err.message;
  }

  Object.values(errors).map(error => {
    if (error) return (message = error);
  });

  return message;
};

//users
module.exports.peek_user = (req, res) => {
  Thread.onFind(Informations, null, {ref1: '_id_account', ref2: '_id_config'})
    .then(data => {
      res.json({status: true, res: data}).status(200);
      Log.show(`/GET/user SUCCESS`);
    })
    .catch(err => {
      res.json({status: false, err: err.message}).status(400);
      Log.show(`/GET/user FAILED: ${err.message}`);
    });
};
module.exports.push_user = (req, res) => {
  const {firstname, lastname, username, email, password} = req.body;
  const {information_id, account_id, config_id} = {
    information_id: new mongoose.Types.ObjectId(),
    account_id: new mongoose.Types.ObjectId(),
    config_id: new mongoose.Types.ObjectId(),
  };
  const threads = [
    Thread.onCreate(Informations, {
      _id: information_id,
      _id_account: account_id,
      _id_config: config_id,
      firstname: firstname,
      lastname: lastname,
    }),
    Thread.onCreate(Accounts, {
      _id: account_id,
      username: username,
      email: email,
      password: password,
    }),
    Thread.onCreate(Configs, {_id: config_id}),
  ];
  Thread.onMultiThread(threads)
    .then(data => {
      let error = {status: false, err: ''};
      data.map(data => {
        if (!data.status) return (error = {status: true, err: data.err});
      });
      if (error.status) {
        const threads = [
          Thread.onDelete(Informations, information_id),
          Thread.onDelete(Accounts, account_id),
          Thread.onDelete(Configs, config_id),
        ];
        Thread.onMultiThread(threads);

        const handledError = onHandleError(error.err);
        res.json({status: false, err: handledError}).status(400);
        Log.show(`/POST/user FAILED: ${handledError}`);
      } else {
        res.json({status: true, res: {user_id: information_id}}).status(200);
        Log.show(`/POST/user SUCCESS: new created user "${username}"`);
      }
    })
    .catch(err => {
      const handledError = onHandleError(err);
      res.json({status: false, err: handledError}).status(400);
      Log.show(`/POST/user FAILED: ${handledError}`);
    });
};
module.exports.set_user = (req, res) => {
  const {_id, firstname, lastname, username, email, password} = req.body;
  const {information_id, account_id, config_id} = {
    information_id: new mongoose.Types.ObjectId(),
    account_id: new mongoose.Types.ObjectId(),
    config_id: new mongoose.Types.ObjectId(),
  };
  const threads = [
    Thread.onCreate(Informations, {
      _id: information_id,
      _id_account: account_id,
      _id_config: config_id,
      firstname: firstname,
      lastname: lastname,
    }),
    Thread.onCreate(Accounts, {
      _id: account_id,
      username: username,
      email: email,
      password: password,
    }),
    Thread.onCreate(Configs, {
      _id: config_id,
    }),
    Thread.onFindOne(Informations, {_id: _id}),
  ];
  Thread.onMultiThread(threads)
    .then(data => {
      let error = {status: false, err: ''};
      data.map(data => {
        if (!data.status) return (error = {status: true, err: data.err});
      });
      if (error.status) {
        const threads = [
          Thread.onDelete(Informations, information_id),
          Thread.onDelete(Accounts, account_id),
          Thread.onDelete(Configs, config_id),
        ];
        Thread.onMultiThread(threads);
        const handledError = onHandleError(error.err);
        res.json({status: false, err: handledError}).status(400);
        Log.show(`/UPDATE/user FAILED: ${handledError}`);
      } else {
        const user = data[3].res;
        const threads = [
          Thread.onDelete(Informations, user._id),
          Thread.onDelete(Accounts, user._id_account),
          Thread.onDelete(Configs, user._id_config),
          Thread.onUpdate(Configs, {_id: config_id}, {evaluated: true}),
        ];
        Thread.onMultiThread(threads);
        Thread.onFindOne(
          Informations,
          {_id: information_id},
          {
            ref1: '_id_account',
            ref2: '_id_config',
          },
        ).then(user => {
          const secondary_auth_token = Token.encode(
            {_id: information_id},
            SECRET_KEY2,
            {
              expiresIn: 60 * 60 * 24,
            },
          );
          res
            .json({
              status: true,
              res: {
                user: user,
                secondary_auth_token: secondary_auth_token,
              },
            })
            .status(200);
          Log.show(`/POST/user SUCCESS: new updated user "${username}"`);
        });
      }
    })
    .catch(err => {
      const handledError = onHandleError(err);
      res.json({status: false, err: handledError}).status(400);
      Log.show(`/UPDATE/user FAILED: ${handledError}`);
    });
};

//products
module.exports.peek_products = (req, res) => {
  Thread.onFind(Products, null, null)
    .then(data => {
      res.json({status: true, res: data}).status(200);
      Log.show(`/GET/products SUCCESS`);
    })
    .catch(err => {
      const errors = onHandleError(err);
      res.json({status: false, err: errors}).status(400);
      Log.show(`/GET/products FAILED: ${errors}`);
    });
};
module.exports.push_products = (req, res) => {
  const {name, based, hot_price, cold_price, date_modified} = req.body;
  Thread.onCreate(Products, {
    name: name,
    based: based,
    hot_price: hot_price,
    cold_price: cold_price,
    date_modified: date_modified,
  })
    .then(data => {
      res.json({status: true, res: data}).status(200);
      Log.show(`/POST/products SUCCESS: new created product "${name}"`);
    })
    .catch(err => {
      const errors = onHandleError(err);
      res.json({status: false, err: errors}).status(400);
      Log.show(`/POST/products FAILED: ${errors}`);
    });
};
module.exports.set_products = (req, res) => {
  const {_id, name, based, hot_price, cold_price, date_modified} = req.body;
  Thread.onUpdate(
    Products,
    {_id: _id},
    {
      name: name,
      based: based,
      hot_price: hot_price,
      cold_price: cold_price,
      date_modified: date_modified,
    },
  )
    .then(data => {
      res.json({status: true, res: data}).status(200);
      Log.show(`/POST/products SUCCESS: updated product "${name}"`);
    })
    .catch(err => {
      const handledError = onHandleError(err);
      res.json({status: false, err: handledError}).status(400);
      Log.show(`/UPDATE/products FAILED: ${handledError}`);
    });
};
module.exports.pop_products = (req, res) => {
  const {_id, name} = req.body;
  Thread.onDelete(Products, {_id: mongoose.Types.ObjectId(_id)})
    .then(data => {
      res.json({status: true, res: data}).status(200);
      Log.show(`/GET/products SUCCESS: product deleted "${name}"`);
    })
    .catch(err => {
      const errors = onHandleError(err);
      res.json({status: false, err: errors}).status(400);
      Log.show(`/GET/products FAILED: ${errors}`);
    });
};

//add-ons
module.exports.peek_add_ons = (req, res) => {
  Thread.onFind(Addons, null, null)
    .then(data => {
      res.json({status: true, res: data}).status(200);
      Log.show(`/GET/add-ons SUCCESS`);
    })
    .catch(err => {
      const errors = onHandleError(err);
      res.json({status: false, err: errors}).status(400);
      Log.show(`/GET/add-ons FAILED: ${errors}`);
    });
};
module.exports.push_add_ons = (req, res) => {
  const {name, price, date_modified} = req.body;
  Thread.onCreate(Addons, {
    name: name,
    price: price,
    date_modified: date_modified,
  })
    .then(data => {
      res.json({status: true, res: data}).status(200);
      Log.show(`/POST/add-ons SUCCESS: new created add-ons "${name}"`);
    })
    .catch(err => {
      const errors = onHandleError(err);
      res.json({status: false, err: errors}).status(400);
      Log.show(`/POST/add-ons FAILED: ${errors}`);
    });
};
module.exports.set_add_ons = (req, res) => {
  const {_id, name, price, date_modified} = req.body;
  Thread.onUpdate(
    Addons,
    {_id: _id},
    {
      name: name,
      price: price,
      date_modified: date_modified,
    },
  )
    .then(data => {
      res.json({status: true, res: data}).status(200);
      Log.show(`/POST/add-ons SUCCESS: updated add-on "${name}"`);
    })
    .catch(err => {
      const handledError = onHandleError(err);
      res.json({status: false, err: handledError}).status(400);
      Log.show(`/UPDATE/add-ons FAILED: ${handledError}`);
    });
};
module.exports.pop_add_ons = (req, res) => {
  const {_id, name} = req.body;
  Thread.onDelete(Addons, {_id: _id})
    .then(data => {
      res.json({status: true, res: data}).status(200);
      Log.show(`/GET/add-ons SUCCESS: add-on deleted "${name}"`);
    })
    .catch(err => {
      const errors = onHandleError(err);
      res.json({status: false, err: errors}).status(400);
      Log.show(`/GET/add-ons FAILED: ${errors}`);
    });
};
