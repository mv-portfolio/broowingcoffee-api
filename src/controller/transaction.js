const Log = require('../utility/Log');
const Thread = require('../utility/Thread');
const Products = require('../schemas/products/main');
const Transactions = require('../schemas/transactions');
const Inventory = require('../schemas/inventory');

//transactions
module.exports.peek_transactions = (req, res) => {
  Thread.onFind(Transactions, null, {
    ref1: 'products._id_product',
    ref2: 'products.addons',
  })
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(400).json(err);
    });
};
module.exports.push_transaction = (req, res) => {
  const {receiptTo, discount, products, date_created} = req.body;

  let _id_products = [];
  products.forEach(product => {
    if (_id_products.length === 0) {
      _id_products.push(product._id_product);
      return;
    } else {
      const isExist = _id_products.filter(
        _id_product => String(_id_product) === String(product._id_product),
      );
      if (!isExist) {
        _id_products.push(product._id_product);
      }
    }
  });

  Thread.onFind(
    Products,
    {_id: {$in: _id_products}},
    {ref1: 'consumables._id_item'},
  ).then(async resProducts => {
    let temp_consumes = [];
    resProducts.forEach(resProduct => {
      products.forEach(product => {
        if (String(product._id_product) === String(resProduct._id)) {
          const {consumables} = resProduct;
          consumables.forEach(({_id_item, consumed}) => {
            if (temp_consumes.length === 0) {
              temp_consumes.push({
                _id_item: _id_item._id,
                consumed: consumed,
              });
              return;
            }
            const isExist = temp_consumes.filter(
              consume => consume._id_item === _id_item._id,
            );
            if (!isExist) {
              temp_consumes.push({
                _id_item: _id_item._id,
                consumed: consumed,
              });
            } else {
              temp_consumes = temp_consumes.map(temp_consume => {
                if (temp_consume._id_item === _id_item._id) {
                  return {
                    ...temp_consume,
                    consumed: temp_consume.consumed + consumed,
                  };
                }
                return temp_consume;
              });
            }
          });
        }
      });
    });

    const update = await Inventory.deduct(temp_consumes);
    if (!update) {
      Log.show(`/POST/transaction FAILED`);
      res.status(400).json({status: false, err: 'Not Enough Inventory'});
      return;
    }

    Thread.onCreate(Transactions, {
      receiptTo,
      discount,
      products,
      date_created,
    })
      .then(transaction => {
        Log.show(`/POST/transaction SUCCESS`);
        res.status(200).json({status: true});
      })
      .catch(err => {
        Log.show(`/POST/transaction FAILED`);
        res.status(400).json(err);
      });
  });
};
