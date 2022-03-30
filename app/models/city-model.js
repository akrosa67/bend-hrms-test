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
    state: {
        type: Number,
        ref: 'State'
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("City", citySchema);