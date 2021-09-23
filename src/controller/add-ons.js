const Log = require('../utility/Log');
const Thread = require('../utility/Thread');
const Addons = require('../schemas/products/add-ons');
const errorHandler = require('./errorHandler');

//add-ons
module.exports.peek_add_ons = (req, res) => {
  Thread.onFind(Addons, null, null)
    .then(data => {
      Log.show(`/GET/add-ons SUCCESS`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errors = errorHandler(err);
      Log.show(`/GET/add-ons FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
    });
};
module.exports.push_add_ons = (req, res) => {
  const {name, price, date_modified} = req.body;
  Thread.onCreate(Addons, {name, price, date_modified})
    .then(data => {
      Log.show(`/POST/add-ons SUCCESS: new created add-ons "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errors = errorHandler(err);
      Log.show(`/POST/add-ons FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
    });
};
module.exports.set_add_ons = (req, res) => {
  const {_id, name, price, date_modified} = req.body;
  Thread.onUpdateOne(Addons, {name}, {name, price, date_modified})
    .then(data => {
      Log.show(`/POST/add-ons SUCCESS: updated add-on "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const handledError = errorHandler(err);
      Log.show(`/UPDATE/add-ons FAILED: ${handledError}`);
      res.status(400).json({status: false, err: handledError});
    });
};
module.exports.pop_add_ons = (req, res) => {
  const {name} = req.body;
  Thread.onDelete(Addons, {name})
    .then(data => {
      Log.show(`/GET/products SUCCESS: products/addons deleted "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errors = errorHandler(err);
      Log.show(`/GET/products FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
    });
};
