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
    shortName: {
        type: String,
        required: true
    },
    cities: [
        {
            type: Number,
            ref: 'zgCity'
        }
    ],
    country: {
        type: Schema.Types.ObjectId,
        ref: 'zgCountry'
    },
    status: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("zgState", stateSchema);