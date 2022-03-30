const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    companyId: [{
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    }],
    branchId: [{
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    }],
    onboardId: {
        type: Schema.Types.ObjectId,
        // ref: 'Branch',
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    designationId: {
        type: Schema.Types.ObjectId,
        ref: 'Designation',
        required: true
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    empCode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        // min: '1987-09-28',
        // max: '1994-05-23'
        required: true
    },
    mobileNo: {
        type: Number,
        required: true
    },
    alterMobileNo: {
        type: Number
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    maritalStatus: {
        type: String,
        enum: ['married', 'widowed', 'separated', 'divorced', 'single'],
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    homeTown: {
        type: String
    },
    area: {
        type: String
    },
    settledIn: {
        type: String
    },
    pAddress: {
        type: String,
        required: true
    },
    tAddress: {
        type: String
    },
    profileImage: {
        type: String
    },
    biometricAccess: {
        type: String,
        required: true,
        unique: true
    },
    doj: {
        type: Date
    },
    callVerify: {
        type: String,
        required: true
    },
    trainingBranch: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sessionId: [{
        type: Schema.Types.ObjectId,
        ref: 'zgsession',
        required: true
    }],
    bank: [{
        id: {
            type: String,
        },
        bankName: {
            type: String,
            required: true
        },
        branchName: {
            type: String,
            required: true
        },
        ifsc: {
            type: String,
            required: true
        },
        accountName: {
            type: String,
            required: true
        },
        accountNo: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        is_default: {
            type: Boolean
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
    family_details: [{
        id: {
            type: String,
        },
        relationName: {
            type: String,
        },
        relationship: {
            type: String,
        },
        relationMobile: {
            type: String,
        },
        relationAddress: {
            type: String,
        },
        attachments: {
            type: String
        },
        is_verified: {
            type: Boolean,
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
    reference: [{
        id: {
            type: String,
        },
        referenceName: {
            type: String,
        },
        referenceMobile: {
            type: String,
        },
        referenceAddress: {
            type: String,
        },
        attachments: {
            type: String
        },
        is_verified: {
            type: Boolean,
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
    kyc_received_documents: [{
        id: {
            type: String,
        },
        docId: {
            type: Schema.Types.ObjectId,
            ref: 'Document',
        },
        mode: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
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
    workExp: [{
        companyName: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        fromDate: {
            type: Date,
            required: true
        },
        toDate: {
            type: Date,
            required: true
        },
        totalExp: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        attachments: {
            type: String
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
    hike: [{
        hikedate: {
            type: Date,
            required: false
        },
        hikeamount: {
            type: String
        },
        hike_per: {
            type: String
        },
        current_salary: {
            type: String
        },
        hiked_salary: {
            type: String
        },
        notes: {
            type: String
        },
        nhike_tenure: {
            type: String
        },
        nhikedate: {
            type: Date,
        },
        nhikeamount: {
            type: String
        },
        nhike_per: {
            type: String
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
    forward: [{
        forwardby: {
            type: Schema.Types.ObjectId,
        },
        forwardto: {
            type: Schema.Types.ObjectId,
        },
        forwarddate: {
            type: Date,
        },
        approvedon: {
            type: Date,
        },
        approvedstatus: {
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
    empStatus: {
        type: Number,
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


/**
 * Save password in encrypted format and Update date (updatedAt)
 */

employeeSchema.pre('save', function (next) {
    var employee = this;
    employee.updatedAt = new Date;

    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(employee.password ? employee.password : '', salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                employee.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});


/**
 * Create method to compare password input to password saved in database
 */

employeeSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model("employee", employeeSchema, 'employees');