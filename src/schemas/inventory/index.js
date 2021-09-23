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

schema.statics.deduct = async function (consumes) {
  try {
    console.log('CONSUMES', consumes);
    let temp_inventory = [];
    consumes.forEach(consume => {
      temp_inventory.push(consume._id_item);
    });

    const inventory = await this.find({_id: {$in: temp_inventory}});
    inventory.forEach(item => {
      let temp_item = item;
      consumes.forEach(async consume => {
        if (String(consume._id_item) === String(item._id)) {
          temp_item.quantity = item.quantity - consume.consumed;
          const update = await this.updateOne(
            {_id: consume._id_item},
            temp_item,
          );
          if (!update.ok) {
            throw Error('Failed updating from Inventory');
          }
        }
      });
    });
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = mongoose.model('inventory', schema);
