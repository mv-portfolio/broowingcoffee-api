const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Account must not have an empty id'],
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [5, 'Username must be valid'],
      unique: [true, 'Username is already exist'],
      required: [true, 'Please provide a Username'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: [isEmail, 'Please enter a valid Email'],
      unique: [true, 'Email is already exist'],
      required: [true, 'Please provide your Email Address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide your Password'],
    },
  },
  {
    collection: 'accounts',
  },
);

schema.statics.login = async function (username, password) {
  const account = await this.findOne({
    $or: [{username: username}, {email: username}],
  });
  if (account) {
    if (await bcrypt.compare(password, account.password)) {
      return account._id;
    }
    throw new Error('Username or Password is incorrect');
  }
  throw new Error('Username or Password is incorrect');
};

schema.pre('save', async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

schema.pre('updateOne', async function () {
  let data = this.getUpdate();
  const salt = await bcrypt.genSalt();
  data.password = await bcrypt.hash(data.password, salt);
});

module.exports = mongoose.model('accounts', schema);
