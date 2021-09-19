const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, 'Item name is already exist'],
      minlength: [2, 'Item has invalid name'],
      required: [true, 'Item has an empty name'],
    },
    type: {
      //material or ingredients
      type: String,
      lowercase: true,
      required: [true, 'Item has an empty type'],
    },
    quantity: {
      type: Number,
      required: [true, 'Item has invalid number of quantity'],
    },
    cost: {
      type: Number,
      required: [true, 'Item has invalid cost'],
    },
    date_expired: {
      type: Number,
      default: null,
    },
    date_modified: {
      type: Number,
      default: new Date().getTime(),
    },
  },
  {
    collection: 'inventory',
  },
);

module.exports = mongoose.model('inventory', schema);
