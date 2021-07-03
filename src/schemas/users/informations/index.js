const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Information must not have an empty id'],
    },
    _id_account: {
      type: Schema.Types.ObjectId,
      ref: 'accounts',
      required: [true, 'Information must not have an empty account'],
    },
    _id_config: {
      type: Schema.Types.ObjectId,
      ref: 'configs',
      required: [true, 'Information must not have an empty config'],
    },
    firstname: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [2, 'Firstname must be valid name'],
      required: [true, 'Please provide your Firstname'],
    },
    lastname: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [2, 'Lastname must be valid name'],
      required: [true, 'Please provide your Lastname'],
    },
  },
  {
    collection: 'informations',
  },
);

module.exports = mongoose.model('informations', schema);
