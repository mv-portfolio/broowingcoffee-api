const Log = require('../utility/Log');
const Thread = require('../utility/Thread');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Informations = require('../schemas/users/informations');
const Accounts = require('../schemas/users/accounts');
const Configs = require('../schemas/users/configs');

const errorHandler = require('./errorHandler');

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
          Thread.onDelete(Informations, {_id: information_id}),
          Thread.onDelete(Accounts, {_id: account_id}),
          Thread.onDelete(Configs, {_id: config_id}),
        ];
        Thread.onMultiThread(threads);

        const errMessage = errorHandler(error.err);
        Log.show(`/POST/user FAILED: ${errMessage}`);
        res.status(400).json({status: false, err: errMessage});
      } else {
        Log.show(`/POST/user SUCCESS: new created user "${username}"`);
        res.status(200).json({status: true, res: {user_id: information_id}});
      }
    })
    .catch(err => {
      const errMessage = errorHandler(err);
      Log.show(`/POST/user FAILED: ${errMessage}`);
      res.status(400).json({status: false, err: errMessage});
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
      if (!data) {
        res.status(400).json({status: false, err: 'User not found'});
        return;
      }

      const account = data._id_account;
      const config = data._id_config;

      const isCorrectPassword = await bcrypt.compare(
        currentPassword,
        account.password,
      );

      if (!isCorrectPassword) {
        res
          .status(400)
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

      Thread.onMultiThread(threads).then(async dataUpdates => {
        let error = {status: false, err: ''};
        dataUpdates.forEach(dataUpdate => {
          if (!dataUpdate.status) {
            error = {status: true, err: dataUpdate.err};
          }
        });
        const salt = await bcrypt.genSalt();
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
                password: await bcrypt.hash(currentPassword, salt),
              },
            ),
            Thread.onUpdateOne(Configs, {_id: config._id}, {isAssessed: false}),
          ];
          Thread.onMultiThread(threads).then(() => {
            const errMessage = errorHandler(error.err);
            res.status(400).json({status: false, err: errMessage});
          });
        } else {
          Thread.onUpdateOne(
            Accounts,
            {_id: account._id},
            {
              password: await bcrypt.hash(password, salt),
            },
          ).then(() => {
            res.status(200).json({status: true, res: {user_id: _id}});
          });
        }
      });
    })
    .catch(err => {
      res.status(400).json({status: false, err: err.message});
    });
};

module.exports.pop_user = (req, res) => {
  const {_id} = req.body;

  Thread.onFindOne(
    Informations,
    {_id},
    {ref1: '_id_account', ref2: '_id_config'},
  ).then(data => {
    if (!data) {
      res.status(400).json({status: false, err: 'User not found'});
      return;
    }

    const {_id_account, _id_config} = data;

    const threads = [
      Thread.onDelete(Informations, {_id}),
      Thread.onDelete(Accounts, {_id: _id_account}),
      Thread.onDelete(Configs, {_id: _id_config}),
    ];

    Thread.onMultiThread(threads).then(data => {
      let error = {status: false};
      data.forEach(({status}) => {
        if (!status) error.status = true;
      });

      if (error.status) {
        res.status(400).json({status: false});
        return;
      }
      res.status(200).json({status: true});
    });
  });
};
