const Log = require('../utility/Log');
const Thread = require('../utility/Thread');
const Token = require('../utility/Token');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Informations = require('../schemas/users/informations');
const Accounts = require('../schemas/users/accounts');
const Configs = require('../schemas/users/configs');
const Products = require('../schemas/products/main');
const Addons = require('../schemas/products/add-ons');

const onHandleError = err => {
  let message = '';
  let errors = {firstname: '', lastname: '', username: '', email: '', name: ''};

  if (err.message.includes('Validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
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
  }

  if (err.message.length !== 0) {
    message = err.message;
  }

  Object.values(errors).forEach(error => {
    if (error) return (message = error);
  });

  return message;
};

//users
module.exports.peek_user = (req, res) => {
  Thread.onFind(Informations, null, {ref1: '_id_account', ref2: '_id_config'})
    .then(data => {
      Log.show(`/GET/user SUCCESS`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      Log.show(`/GET/user FAILED: ${err.message}`);
      res.status(400).json({status: false, err: err.message});
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
    .then(dataCreates => {
      let error = {status: false, err: ''};
      dataCreates.forEach(dataCreate => {
        if (!dataCreate.status) {
          return (error = {status: true, err: dataCreate.err});
        }
      });
      if (error.status) {
        const threads = [
          Thread.onDelete(Informations, information_id),
          Thread.onDelete(Accounts, account_id),
          Thread.onDelete(Configs, config_id),
        ];
        Thread.onMultiThread(threads);

        const handledError = onHandleError(error.err);
        Log.show(`/POST/user FAILED: ${handledError}`);
        res.status(400).json({status: false, err: handledError});
      } else {
        Log.show(`/POST/user SUCCESS: new created user "${username}"`);
        res.status(200).json({status: true, res: {user_id: information_id}});
      }
    })
    .catch(err => {
      const handledError = onHandleError(err);
      Log.show(`/POST/user FAILED: ${handledError}`);
      res.status(400).json({status: false, err: handledError});
    });
};
module.exports.set_user = (req, res) => {
  const {
    _id,
    firstname,
    lastname,
    username,
    email,
    newPassword: password,
    currentPassword,
  } = req.body;

  Thread.onFindOne(
    Informations,
    {_id: _id},
    {ref1: '_id_account', ref2: '_id_config'},
  )
    .then(async data => {
      const account = data._id_account;
      const config = data._id_config;

      const isCorrectPassword = await bcrypt.compare(
        currentPassword,
        account.password,
      );

      if (!isCorrectPassword) {
        res
          .status(470)
          .json({status: false, err: 'Current Password is incorrect'});
        return;
      }

      const threads = [
        Thread.onUpdateOne(
          Informations,
          {_id: _id},
          {
            firstname,
            lastname,
          },
        ),
        Thread.onUpdateOne(
          Accounts,
          {_id: account._id},
          {
            username,
            email,
            password,
          },
        ),
        Thread.onUpdateOne(Configs, {_id: config._id}, {isAssessed: true}),
      ];

      Thread.onMultiThread(threads).then(dataUpdates => {
        let error = {status: false, err: ''};
        dataUpdates.forEach(dataUpdate => {
          if (!dataUpdate.status) {
            error = {status: true, err: dataUpdate.err};
          }
        });

        if (error.status) {
          const threads = [
            Thread.onUpdateOne(
              Informations,
              {_id: _id},
              {firstname: data.firstname, lastname: data.lastname},
            ),
            Thread.onUpdateOne(
              Accounts,
              {_id: account._id},
              {
                username: account.username,
                email: account.email,
                password: currentPassword,
              },
            ),
            Thread.onUpdateOne(Configs, {_id: config._id}, {isAssessed: false}),
          ];
          Thread.onMultiThread(threads);
          const errorHandler = onHandleError(error.err);
          res.status(470).json({status: false, err: errorHandler});
        } else {
          res.status(200).json({status: true, res: {user_id: _id}});
        }
      });
    })
    .catch(err => {
      res.status(470).json({status: false, err: err});
    });
};

//products
module.exports.peek_products = (req, res) => {
  Thread.onFind(Products, null, null)
    .then(data => {
      Log.show(`/GET/products SUCCESS`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errors = onHandleError(err);
      Log.show(`/GET/products FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
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
      Log.show(`/POST/products SUCCESS: new created product "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errors = onHandleError(err);
      Log.show(`/POST/products FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
    });
};
module.exports.set_products = (req, res) => {
  const {_id, name, based, hot_price, cold_price, date_modified} = req.body;
  Thread.onUpdateOne(
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
      Log.show(`/POST/products SUCCESS: updated product "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const handledError = onHandleError(err);
      Log.show(`/UPDATE/products FAILED: ${handledError}`);
      res.status(400).json({status: false, err: handledError});
    });
};
module.exports.pop_products = (req, res) => {
  const {_id, name} = req.body;
  Thread.onDelete(Products, {_id: mongoose.Types.ObjectId(_id)})
    .then(data => {
      Log.show(`/GET/products SUCCESS: product deleted "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errors = onHandleError(err);
      Log.show(`/GET/products FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
    });
};

//add-ons
module.exports.peek_add_ons = (req, res) => {
  Thread.onFind(Addons, null, null)
    .then(data => {
      Log.show(`/GET/add-ons SUCCESS`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errors = onHandleError(err);
      Log.show(`/GET/add-ons FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
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
      Log.show(`/POST/add-ons SUCCESS: new created add-ons "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errors = onHandleError(err);
      Log.show(`/POST/add-ons FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
    });
};
module.exports.set_add_ons = (req, res) => {
  const {_id, name, price, date_modified} = req.body;
  Thread.onUpdateOne(
    Addons,
    {_id: _id},
    {
      name: name,
      price: price,
      date_modified: date_modified,
    },
  )
    .then(data => {
      Log.show(`/POST/add-ons SUCCESS: updated add-on "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const handledError = onHandleError(err);
      Log.show(`/UPDATE/add-ons FAILED: ${handledError}`);
      res.status(400).json({status: false, err: handledError});
    });
};
module.exports.pop_add_ons = (req, res) => {
  const {_id, name} = req.body;
  Thread.onDelete(Addons, {_id: _id})
    .then(data => {
      Log.show(`/GET/add-ons SUCCESS: add-on deleted "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errors = onHandleError(err);
      Log.show(`/GET/add-ons FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
    });
};
