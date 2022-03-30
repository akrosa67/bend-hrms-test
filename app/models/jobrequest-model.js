const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const JobRequestSchema = new Schema({
    jobReqNumber: {
        type: String,
        required: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true,
        enum: ['Full Time', 'Part Time']
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Departments',
        required: true
    },
    designationId: {
        type: Schema.Types.ObjectId,
        ref: 'Designations',
        required: true
    },
    vacancyType: {
        type: String,
        enum: ['Hot Vacancy', 'Replacement', 'Notice Replacement', 'Termination Replacement'],
        required: false
    },
    jobDescription: {
        type: String,
        required: false
    },
    priority: {
        type: String,
        required: false
    },
    Approvals: [{
        forwardBy: {
            type: Schema.Types.ObjectId,
        },
        forwardTo: {
            type: Schema.Types.ObjectId,
        },
        forwardDate: {
            type: Date,
        },
        approvedOn: {
            type: Date,
        },
        approvedStatus: {
            type: Number,
        },
        notes: {
            type: String,
        },
        status: {
            type: Number,
        },
        insertedBy: {
            type: Schema.Types.ObjectId,
            required: true
        },
        insertedOn: {
            type: Date,
            required: true
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            required: false
        },
        updatedOn: {
            type: Date,
            required: false
        }
    }],
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

module.exports = mongoose.model("Jobrequest", JobRequestSchema);