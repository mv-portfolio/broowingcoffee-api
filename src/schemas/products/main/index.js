const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, 'Product name is already exist'],
      minlength: [2, 'Product has invalid name'],
      required: [true, 'Product has an empty name'],
    },
    based: {
      type: String,
      lowercase: true,
      required: [true, 'Product has an empty based'],
    },
    hot_price: {
      type: Number,
      default: null,
    },
    cold_price: {
      type: Number,
      default: null,
    },
    date_modified: {
      type: Number,
      default: new Date().getTime(),
    },
    consumables: [
      {
        _id: false,
        _id_item: {
          type: Schema.Types.ObjectId,
          ref: 'inventory',
        },
        consumed: {
          type: Number,
          required: [true, 'Product must have consumed quantity on inventory'],
        },
      },
    ],
  },
  {
    collection: 'products',
  },
);

module.exports = mongoose.model('products', schema);
