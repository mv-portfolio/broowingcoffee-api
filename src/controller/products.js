const Log = require('../utility/Log');
const Thread = require('../utility/Thread');
const Products = require('../schemas/products/main');

const errorHandler = require('./errorHandler');

//products
module.exports.peek_products = (req, res) => {
  const {name, _id} = req.query;
  Thread.onFind(
    Products,
    {$or: name || _id ? [{name}, {_id}] : [{__v: 0}]},
    {ref1: 'consumables._id_item'},
  )
    .then(data => {
      Log.show(`/GET/products SUCCESS`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errMessage = errorHandler(err);
      Log.show(`/GET/products FAILED: ${errMessage}`);
      res.status(400).json({status: false, err: errMessage});
    });
};
module.exports.push_products = (req, res) => {
  const {name, based, hot_price, cold_price, date_modified, consumables} =
    req.body;

  Thread.onCreate(Products, {
    name,
    based,
    hot_price,
    cold_price,
    date_modified,
    consumables,
  })
    .then(data => {
      Log.show(`/POST/products SUCCESS: new created product "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errMessage = errorHandler(err);
      Log.show(`/POST/products FAILED: ${errMessage}`);
      res.status(400).json({status: false, err: errMessage});
    });
};
module.exports.set_products = (req, res) => {
  const {_id, name, based, hot_price, cold_price, date_modified, consumables} =
    req.body;

  Thread.onUpdateOne(
    Products,
    {name: name},
    {
      name,
      based,
      hot_price,
      cold_price,
      date_modified,
      consumables,
    },
  )
    .then(data => {
      Log.show(`/POST/products SUCCESS: updated product "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errMessage = errorHandler(err);
      Log.show(`/UPDATE/products FAILED: ${errMessage}`);
      res.status(400).json({status: false, err: errMessage});
    });
};
module.exports.pop_products = (req, res) => {
  const {name} = req.body;
  Thread.onDelete(Products, {name})
    .then(data => {
      Log.show(`/GET/products SUCCESS: products/main deleted "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errMessage = errorHandler(err);
      Log.show(`/GET/products FAILED: ${errMessage}`);
      res.status(400).json({status: false, err: errMessage});
    });
};
