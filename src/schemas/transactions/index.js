const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    discount: {
      type: Number,
      default: 0,
    },
    receiptTo: {
      type: String,
      default: null,
    },
    products: [
      {
        _id: false,
        _id_product: {
          type: Object,
          required: [true, 'transaction must specify the product id'],
        },
        addons: [
          {
            type: Object,
          },
        ],
        type: {
          type: String,
          required: [true, 'transaction must specify the product type'],
        },
        discount: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          required: [true, 'transaction must specify the product price'],
        },
      },
    ],
    date_created: {
      type: Number,
      default: new Date().getTime(),
    },
  },
  {
    collection: 'transactions',
  },
);

module.exports = mongoose.model('transactions', schema);
