const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    module: {
      type: String,
      required: [true, 'report must specify the module'],
    },
    _id_account: {
      type: Schema.Types.ObjectId,
      ref: 'accounts',
      required: [true, 'report must specify who commit this issued'],
    },
    reference: {
      type: Object,
    },
    action: {
      type: String,
      required: [true, 'report must specify the action'],
    },
    date_created: {
      type: Number,
      default: new Date().getTime(),
    },
  },
  {
    collection: 'reports',
  },
);

module.exports = mongoose.model('reports', schema);
