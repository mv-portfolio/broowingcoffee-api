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
      minlength: [2, 'First Name must be valid name'],
      required: [true, 'Please provide your First Name'],
    },
    lastname: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [2, 'Last Name must be valid name'],
      required: [true, 'Please provide your Last Name'],
    },
  },
  {
    collection: 'informations',
  },
);

module.exports = mongoose.model('informations', schema);
