const responseHandlier = require('../libs/response/status');
const Otp = require('../models/otp-model');
const ObjectId = require('mongodb').ObjectId;
const accountSid = 'AC5f7aa3e639f6d00e862582f3dc8fbfc1';
const authToken = '5518ccd546b26d42ac4e76f01db140a3';
const client = require('twilio')(accountSid, authToken);

module.exports.imageUpload = async(req, res) => {
    try {
        var filename = req.file.filename;
        var filepath = 'http://algrix.in/zgcrm/uploads/' + filename;
        responseHandlier.successResponse(true, filepath, res);

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}

// SEND OTP START
module.exports.sendOtp = async function(req, res) {
        var { empId, refId, mode, mobile } = req.body;

        var minm = 1111;
        var maxm = 9999;

        if ((mobile != '')) {
            var MemberOtp = {}
            MemberOtp.mode = mode;
            MemberOtp.mobile = mobile;
            MemberOtp.refId = refId;
            MemberOtp.empId = empId;
            MemberOtp.otp = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
            MemberOtp.otpstatus = 'open';
            MemberOtp.insertedBy = ObjectId(req.userId);

            let OtpModel = new Otp(MemberOtp);
            await OtpModel.save(async function(err, data) {
                if (err) {
                    responseHandlier.errorResponse(false, err, res)
                } else {

                    client.messages
                        .create({
                            body: data.otp + " is your OTP for reference. Thanks ZeroGravity.",
                            messagingServiceSid: 'MGd1eae9167f48678df1dc505182719e94',
                            to: '+919994871801'
                        })
                        .then(message => {
                            responseHandlier.successResponse(true, data, res);
                        })
                        .done();
                }
            });

        } else {
            res.status(200).json({
                statuscode: 409,
                status: false,
                message: "Enter Mobile number"
            })
        }

    }
    // SEND OTP END

// RESEND OTP START
module.exports.ResendOtp = async function(req, res) {
        try {
            var id = req.body.id;
            var minm = 1111;
            var maxm = 9999;
            var data = {};
            var query = { _id: id };
            await Otp.find(query).then(async results => {
                if (results != undefined && results.length > 0) {
                    data['updatedAt'] = new Date();
                    data['updatedBy'] = ObjectId(req.userId);
                    data['otp'] = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
                    var newvalues = { $set: data };

                    var response = data;
                    Otp.findByIdAndUpdate(id, newvalues, { new: true }, function(err, results) {
                        if (err) {
                            responseHandlier.errorResponse(false, err, res)
                        } else {
                            client.messages
                                .create({
                                    body: results.otp + " is your OTP for reference. Thanks ZeroGravity.",
                                    messagingServiceSid: 'MGd1eae9167f48678df1dc505182719e94',
                                    to: '+919994871801'
                                })
                                .then(message => {
                                    responseHandlier.successResponse(true, results, res);
                                })
                                .done();
                        }
                    });
                }
            });
        } catch (err) {
            responseHandlier.errorResponse(false, err, res)
        }
    }
    // RESEND OTP END

module.exports.verifyOtp = async function(req, res) {
    try {
        let { mobile, otp, empId, refId } = req.body;
        let mobileStatus = await Otp.find({ otpstatus: "open", mobile: mobile }).sort({ _id: -1 }).limit(1);
        if (mobileStatus.length === 0) {
            responseHandlier.errorResponse(false, "Invalid Mobile No or OTP Expired !", res)
        }
        let otpStatus = await Otp.find({ otpstatus: "open", mobile: mobile, otp: otp, empId: empId, refId: refId });
        if (otpStatus.length === 0) {
            responseHandlier.errorResponse(false, "Invalid OTP", res)
        }

        await Otp.updateOne({ otpstatus: "open", mobile: mobile, otp: otp, empId: empId, refId: refId }, {
                $set: {
                    otpstatus: 'closed',
                    updatedAt: new Date(),
                    updatedBy: ObjectId(req.userId)
                }
            })
            .then(async(result, err) => {
                if (err) {
                    responseHandlier.errorResponse(false, err, res)
                } else {
                    responseHandlier.successResponse(true, result, res);
                }
            })
            .catch((e) => {
                responseHandlier.errorResponse(false, err, res)
            })

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}