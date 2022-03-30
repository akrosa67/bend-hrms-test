const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leadServiceSchema = new Schema({
    service: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    companyId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Company'
        }
    ],
    customs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'CustomFields'
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

module.exports = mongoose.model("LeadService", leadServiceSchema);