const Log = require('../utility/Log');
const Token = require('../utility/Token');
const Thread = require('../utility/Thread');
const NodeMailer = new (require('../utility/NodeMailer'))();
const {arrayFind, getPurchasedProducts} = require('../utility/helper');

const Products = require('../schemas/products/main');
const Addons = require('../schemas/products/add-ons');
const Transactions = require('../schemas/transactions');
const Inventory = require('../schemas/inventory');
const errorHandler = require('./errorHandler');

const {SERVER, RECEIPT_SECRET_KEY} = process.env;

//transactions
module.exports.peek_transactions = (req, res) => {
  const {date_start, date_end} = req.query;

  Thread.onFind(
    Transactions,
    date_start && date_end
      ? {
          date_created: {
            $gte: date_start,
            $lt: date_end,
          },
        }
      : null,
    null,
  )
    .then(data => {
      Log.show(`/GET/transaction SUCCESS`);
      res.status(200).json({
        status: true,
        res: {transactions: data, topList: getPurchasedProducts(data)},
      });
    })
    .catch(err => {
      const error = errorHandler(err);
      Log.show(`/GET/transaction FAILED`, error);
      res.status(400).json({status: false, err: error});
    });
};

module.exports.push_transaction = (req, res) => {
  const {receiptTo, discount, products, date_created} = req.body;

  let _id_products = [];
  let temp_products = [];
  products.forEach(product => {
    const _id_product = _id_products.filter(
      _id_product => _id_product === product._id_product,
    )[0];
    if (!_id_product) {
      _id_products.push(product._id_product);
    }
  });

  Thread.onFind(
    Products,
    {_id: {$in: _id_products}},
    {ref1: 'consumables._id_item'},
  ).then(async res_products => {
    let temp_consumes = [];
    const addons = await Addons.find();

    products.forEach(product => {
      let tempProduct = product;
      res_products.forEach(res_product => {
        if (String(product._id_product) === String(res_product._id)) {
          const {consumables} = res_product;

          tempProduct.addons = product.addons.map(addonId => {
            let tempAddon = {};
            addons.forEach(addon => {
              if (addonId === String(addon._id)) tempAddon = addon;
            });
            return tempAddon;
          });
          temp_products.push({...tempProduct, _id_product: res_product});
          consumables.forEach(({_id_item, consumed}) => {
            const _id = String(_id_item._id);
            const temp_consume = arrayFind(temp_consumes, {_id});
            if (!temp_consume) {
              temp_consumes.push({_id, consumed});
              return;
            }
            temp_consumes = temp_consumes.map(temp_consume => {
              if (temp_consume._id === _id) {
                return {
                  ...temp_consume,
                  consumed: temp_consume.consumed + 1,
                };
              }
              return temp_consume;
            });
          });
        }
      });
    });

    const update = await Inventory.deduct(temp_consumes);
    if (!update) {
      Log.show(`/POST/transaction FAILED`, 'Not Enough Item from Inventory');
      res.status(400).json({
        status: false,
        err: 'Not Enough Item from Inventory',
      });
      return;
    }

    Thread.onCreate(Transactions, {
      receiptTo,
      discount,
      products: temp_products,
      date_created,
    })
      .then(async transaction => {
        Log.show(`/POST/transaction SUCCESS`);
        const metaData = await Thread.onFindOne(Transactions, {
          _id: transaction._id,
        });
        res.status(200).json({status: true, res: metaData});

        if (receiptTo) {
          /**
           * create try catch if neccessary
           */
          const token = Token.encode({transaction}, RECEIPT_SECRET_KEY, {
            expiresIn: 60 * 60 * 24 * 30,
          });
          await NodeMailer.send({
            to: receiptTo,
            subject: 'BROOWING COFFEE | RECEIPT',
            html: NodeMailer.template({
              header: `Good day!`,
              paragraph1: `We notice that you are requesting receipt for your latest transaction, if you want to proceed, click the button bellow.`,
              paragraph2: `If you are not requesting for Receipt, you can safety ignore this email.`,
              url: `${SERVER}/receipt/${token}/`,
              buttonText: 'VIEW RECEIPT',
            }),
          });
          Log.show(`Receipt has been successfully sent to ${receiptTo}`);
        }
      })
      .catch(err => {
        Log.show(`/POST/transaction FAILED`);
        res.status(400).json(err);
      });
  });
};
