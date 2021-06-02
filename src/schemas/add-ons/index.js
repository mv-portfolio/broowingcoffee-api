const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, 'Add-ons name is Already exist'],
      minlength: [2, 'Add-ons has invalid name'],
      required: [true, 'Add-ons has an empty name'],
    },
    price: {
      type: Number,
      required: [true, 'Add-ons has an empty price'],
    },
    date_modified: {
      type: Number,
      required: [true, 'Product has an empty date'],
    },
  },
  {
    collection: 'add_ons',
  }
);

module.exports = mongoose.model('add_ons', schema);
