const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const citySchema = new Schema({
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
    state: {
        type: Number,
        ref: 'zgState'
    },
    status: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("zgCity", citySchema);