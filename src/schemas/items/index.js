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
            required: [true, 'Item has an empty name']
        },
        type: {
            type: String,
            lowercase: true,
            required: [true, 'Item has an empty type']
        },
        stock: {
            type: Number,
            required: [true, 'Item has invalid number of stocks']
        },
        amount: {
            type: Number,
            required: [true, 'Item has an empty amount']
        },
        supplier: {
            type: String,
            lowercase: true,
            minlength: [2, 'Item has invalid supplier'],
            required: [true, 'Item has an empty supplier']
        },
        category: {
            type: String,
            lowercase: true,
            minlength: [2, 'Item has invalid category'],
            required: [true, 'Item has an empty category']
        },
        date_expired: {
            type: Number,
            default: 0
        },
        date_purchase: {
            type: Number,
            default: new Date().getTime()
        }
    },
    {
        collection: 'items',
    }
)

module.exports = mongoose.model('items', schema);