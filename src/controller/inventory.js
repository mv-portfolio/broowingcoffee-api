const Log = require('../utility/Log');
const Thread = require('../utility/Thread');
const Products = require('../schemas/products/main');
const Inventory = require('../schemas/inventory');
const errorHandler = require('./errorHandler');
const mongoose = require('mongoose');

//inventory
module.exports.peek_inventory = (req, res) => {
  Thread.onFind(Inventory, null, null)
    .then(data => {
      Log.show(`/GET/inventory SUCCESS`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errMessage = errorHandler(err);
      Log.show(`/GET/inventory FAILED: ${errMessage}`);
      res.status(400).json({status: false, err: errMessage});
    });
};

module.exports.push_inventory = (req, res) => {
  const {name, cost, itemType, quantity, date_expired, date_modified} =
    req.body;
  Thread.onCreate(Inventory, {
    name,
    cost,
    type: itemType,
    quantity,
    date_expired,
    date_modified,
  })
    .then(data => {
      Log.show(`/POST/inventory SUCCESS: new created item "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errMessage = errorHandler(err);
      Log.show(`/POST/inventory FAILED: ${errMessage}`);
      res.status(400).json({status: false, err: errMessage});
    });
};

module.exports.set_inventory = (req, res) => {
  const {name, cost, itemType, quantity, date_expired, date_modified} =
    req.body;

  Thread.onUpdateOne(
    Inventory,
    {name},
    {
      name,
      cost,
      type: itemType,
      quantity,
      date_expired,
      date_modified,
    },
  )
    .then(data => {
      Log.show(`/UPDATE/inventory SUCCESS: updated add-on "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errMessage = errorHandler(err);
      Log.show(`/UPDATE/inventory FAILED: ${errMessage}`);
      res.status(400).json({status: false, err: errMessage});
    });
};

module.exports.pop_inventory = (req, res) => {
  const {name} = req.body;

  Thread.onFind(Products, null, {ref1: 'consumables._id_item'}).then(
    products => {
      let hasReference = false;
      products.forEach((product, index) => {
        product.consumables.forEach(consumable => {
          if (name === consumable._id_item.name) return (hasReference = true);
        });
      });

      if (hasReference) {
        Log.show(
          `/DELETE/inventory FAILED: has reference from Product.consumables`,
        );
        res.status(400).json({
          status: false,
          err: `Item ${name} has been referenced by one of the Products`,
        });
        return;
      }

      Thread.onDelete(Inventory, {name})
        .then(data => {
          Log.show(`/DELETE/inventory SUCCESS: deleted "${name}"`);
          res.status(200).json({status: true, res: data});
        })
        .catch(err => {
          const errMessage = errorHandler(err);
          Log.show(`/DELETE/inventory FAILED: ${errMessage}`);
          res.status(400).json({status: false, err: errMessage});
        });
    },
  );
};
