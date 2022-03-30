const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leadSchema = new Schema({
    leadType: {
        type: String,
        enum: ['wedding', 'nonWedding'],
        required: true
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: 'Branch'
    },
    leadSourceId: {
        type: Schema.Types.ObjectId,
        ref: 'Source'
    },
    leadSubSourceId: {
        type: Schema.Types.ObjectId,
        ref: 'SubSource'
    },
    leadServiceId: {
        type: Schema.Types.ObjectId,
        ref: 'LeadService                                                                                                                           '
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contact: {
        primaryMobile: {
            code: {
                type: Number,
                required: true
            },
            number: {
                type: Number,
                required: true
            }
        },
        secondaryMobile: {
            code: {
                type: Number
            },
            number: {
                type: Number
            }
        },
        whatsAppNo: {
            code: {
                type: Number
            },
            number: {
                type: Number
            }
        }
    },
    clientLocation: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    address: {
        primary: {
            type: String,
            required: true
        },
        secondary: {
            type: String,
            required: true
        }
    },
    city: {
        type: Number,
        ref: 'City',
        required: true
    },
    state: {
        type: Number,
        ref: 'State',
        required: true
    },
    country: {
        type: Number,
        ref: 'Country',
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    customField: [
        {
            type: Schema.Types.ObjectId,
            ref: 'CustomField'
        }
    ],
    priorityStatusId: {
        type: Schema.Types.ObjectId,
        ref: 'Priority'
    },
    processStatus: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Priority'
        },
        statusName: {
            type: String
        }
    },
    forwardedTo: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Company'
        }
    ],
    activity: [
        {
            type: String
        }
    ],
    leadAssign: [
        {
            assignedTo: {
                type: Schema.Types.ObjectId,
                ref: 'employee'
            },
            leadStatus: {
                type: String
            },
            assignedAt: {
                type: Schema.Types.ObjectId,
                ref: 'employee'
            },
            status: {
                type: Number
            },
            insertedBy: {
                type: Schema.Types.ObjectId,
                ref: 'employee'
            },
            updatedBy: {
                type: Schema.Types.ObjectId,
                ref: 'employee'
            },
            createdAt: {
                type: Date
            },
            updatedAt: {
                type: Date
            },
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

module.exports = mongoose.model("Lead", leadSchema);