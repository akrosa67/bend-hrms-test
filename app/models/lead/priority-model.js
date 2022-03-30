const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const prioritySchema = new Schema({
    priority: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true
    },
    colorCode: {
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

module.exports = mongoose.model("Priority", prioritySchema);