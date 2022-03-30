const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OtpSchema = new Schema({
    empId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    refId: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    otpstatus: {
        type: String,
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

module.exports = mongoose.model("Otp", OtpSchema);