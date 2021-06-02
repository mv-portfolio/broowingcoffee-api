const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Account has an empty id'],
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [2, 'Username must be valid'],
      unique: [true, 'Username is already exist'],
      required: [true, 'Account has an empty username'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email.'],
      unique: [true, 'Email is already exist.'],
      required: [true, 'Account has an empty email'],
    },
    password: {
      type: String,
      required: [true, 'Account has an empty password'],
    },
  },
  {
    collection: 'accounts',
  }
);

schema.statics.login = async function (username, password) {
  const account = await this.findOne({ $or: [{ username: username }, { email: username }] });
  if (account) {
    if (await bcrypt.compare(password, account.password)) {
      return account._id;
    }
    throw new Error('Username and Password is incorrect.');
  }
  throw new Error('Username and Password is incorrect.');
};

schema.pre('save', async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('accounts', schema);
