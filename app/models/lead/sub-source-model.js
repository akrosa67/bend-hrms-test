const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subSourceSchema = new Schema({
    subSourceName: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    sourceId: {
        type: Schema.Types.ObjectId,
        ref: 'Source',
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    insertedBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("SubSource", subSourceSchema);