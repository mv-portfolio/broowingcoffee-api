const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    date_created: {
      type: Number,
      default: new Date().getTime(),
    },
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
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: [true, 'transaction must specify the product id'],
        },
        addons: [
          {
            type: Schema.Types.ObjectId,
            ref: 'add_ons',
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
  },
  {
    collection: 'transactions',
  },
);

module.exports = mongoose.model('transactions', schema);
