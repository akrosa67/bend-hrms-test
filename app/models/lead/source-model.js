const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sourceSchema = new Schema({
    sourceName: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    subSources: [
        {
            type: Schema.Types.ObjectId,
            ref: 'SubSource'
        }
    ],
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

module.exports = mongoose.model("Source", sourceSchema);