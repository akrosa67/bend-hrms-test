const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customFieldSchema = new Schema({
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: 'LeadService',
        required: true
    },
    labelName: {
        type: String,
        required: true
    },
    datatype: {
        type: String,
        required: true
    },
    helptext: {
        type: String,
        required: true
    },
    defaultValue: {
        type: String,
        required: true
    },
    isMandatory: {
        type: Boolean,
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

module.exports = mongoose.model("CustomField", customFieldSchema);