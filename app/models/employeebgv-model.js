const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EmployeeBgvSchema = new Schema({
    empId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    refId: {
        type: String
    },
    refType: {
        type: String,
        enum: ['family', 'reference'],
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: false
    },
    details: [{
        id: {
            type: String
        },
        type: {
            type: String
        },
        comments: {
            type: String
        },
        attachments: {
            type: String
        },
        insertedBy: {
            type: Schema.Types.ObjectId,
            required: false
        },
        insertedOn: {
            type: Date,
            required: false
        }
    }],
    report_feedback: {
        type: String
    },
    bgv_status: {
        type: String
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
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("EmployeeBgv", EmployeeBgvSchema);