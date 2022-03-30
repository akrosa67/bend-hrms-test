const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const stateSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cities: [
        {
            type: Number,
            ref: 'City'
        }
    ],
    country: {
        type: Schema.Types.ObjectId,
        ref: 'Country'
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("State", stateSchema);