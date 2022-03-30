const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const countrySchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    shortName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    countryCode: {
        type: Number,
        required: true
    },
    states: [
        {
            type: Number,
            ref: 'zgState'
        }
    ],
    status: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("zgCountry", countrySchema);