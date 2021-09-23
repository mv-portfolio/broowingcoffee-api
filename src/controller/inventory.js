const Log = require('../utility/Log');
const Thread = require('../utility/Thread');
const Inventory = require('../schemas/inventory');
const errorHandler = require('./errorHandler');

//inventory
module.exports.peek_inventory = (req, res) => {
  Thread.onFind(Inventory, null, null)
    .then(data => {
      Log.show(`/GET/inventory SUCCESS`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errors = errorHandler(err);
      Log.show(`/GET/inventory FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
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
      const errors = errorHandler(err);
      Log.show(`/POST/inventory FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
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
      const handledError = errorHandler(err);
      Log.show(`/UPDATE/inventory FAILED: ${handledError}`);
      res.status(400).json({status: false, err: handledError});
    });
};
module.exports.pop_inventory = (req, res) => {
  const {name} = req.body;
  Thread.onDelete(Inventory, {name})
    .then(data => {
      Log.show(`/DELETE/inventory SUCCESS: deleted "${name}"`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const errors = errorHandler(err);
      Log.show(`/DELETE/inventory FAILED: ${errors}`);
      res.status(400).json({status: false, err: errors});
    });
};
