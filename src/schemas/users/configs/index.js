const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            required: [true, 'Config has an empty id']
        },
        verified: {
            type: Boolean,
            default: false
        },
        evaluated: {
            type: Boolean,
            default: false
        }
    },
    {
        collection: 'configs',
    }
)

module.exports = mongoose.model('configs', schema);