const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const departmentSchema = new Schema({
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
    designations: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Designation'
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

module.exports = mongoose.model("Department", departmentSchema);