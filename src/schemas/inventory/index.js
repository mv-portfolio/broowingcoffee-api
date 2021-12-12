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
    if (!consumes.length) return false;

    let temp_inventory = [];
    consumes.forEach(consume => {
      temp_inventory.push(consume._id);
    });

    const inventory = await this.find({_id: {$in: temp_inventory}});
    let isNotEnough = false;
    inventory.forEach(item => {
      let temp_item = item;
      consumes.forEach(async consume => {
        if (isNotEnough) return;
        const consume_id = String(consume._id);
        if (consume_id === String(item._id)) {
          if (item.quantity < consume.consumed) return (isNotEnough = true);
          temp_item.quantity = item.quantity - consume.consumed;
          const update = await this.updateOne({_id: consume_id}, temp_item);
          if (!update.ok) {
            throw Error('Failed updating from Inventory');
          }
        }
      });
    });
    if (isNotEnough) return false;
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = mongoose.model('inventory', schema);
