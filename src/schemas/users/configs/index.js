const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Config must not have an empty id'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAssessed: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'configs',
  },
);

module.exports = mongoose.model('configs', schema);
