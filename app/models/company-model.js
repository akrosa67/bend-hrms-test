const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    branches: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Branch'
        }
    ],
    leades: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Lead'
        }
    ],
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

module.exports = mongoose.model("Company", companySchema);