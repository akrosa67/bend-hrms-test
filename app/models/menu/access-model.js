const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const accessSubHeaderSchema = new Schema({
    accessName: {
        type: String,
        required: true
    },
    accessDescription: {
        type: String,
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

module.exports = mongoose.model("Access", accessSubHeaderSchema);