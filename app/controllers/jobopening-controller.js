const JobOpening = require('../models/jobopening-model');
const responseHandlier = require('../libs/response/status');
const ObjectId = require('mongodb').ObjectId;
const commonFunction = require('../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add JobOpening details in db
 */

module.exports.addJobOpening = async(req, res) => {
    try {
        let JobOpeningDetails = req.body;
        let JobOpeningData = await JobOpening.findOne({ status: { $in: [1, 2] } }, ).sort({ createdAt: -1 });
        JobOpeningDetails.jobOpeningNumber = (JobOpeningData === null) ? 'JO_00001' : await commonFunction.incrementString(JobOpeningData.jobOpeningNumber);
        JobOpeningDetails.insertedBy = ObjectId(req.userId);
        JobOpeningDetails.status = 1;
        const newJobOpening = new JobOpening(JobOpeningDetails);

        newJobOpening.save((error, user) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res);
            } else {
                responseHandlier.successResponse(true, 'Successfully Inserted', res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}

/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all JobOpening details in db
 */

module.exports.getAllJobOpenings = (req, res) => {
    try {

        JobOpening.find({ status: { $in: [1, 2] } }, (error, JobOpenings) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (JobOpenings) {
                responseHandlier.successResponse(true, JobOpenings, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}

/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get Active JobOpening details in db
 */

module.exports.getActiveJobOpenings = (req, res) => {
    try {

        JobOpening.find({ status: 1 }, (error, JobOpenings) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (JobOpenings) {
                responseHandlier.successResponse(true, JobOpenings, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}

/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get branch details by id in db
 */

module.exports.getByJobOpeningId = (req, res) => {

    try {

        if (!req.body.JobOpeningId) {
            return responseHandlier.errorResponse(false, "JobOpening Id is required.", res);
        }

        const JobOpeningId = {
            _id: ObjectId(req.body.JobOpeningId)
        };

        JobOpening.findOne(JobOpeningId, (error, JobOpeningDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (JobOpeningDetails) {
                responseHandlier.successResponse(true, JobOpeningDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid JobOpening Id', res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}

/**
 * @PUT
 * @param {*} req
 * @param {*} res
 * @returns to update JobOpening details by id
 */

module.exports.updateByJobOpeningId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "JobOpening Id is required.", res);
        }

        const JobOpeningId = {
            _id: ObjectId(req.body._id)
        };

        const requestData = req.body;
        if (req.body.pubStatus) {
            requestData.pubBy = ObjectId(req.userId);
            requestData.pubDate = new Date();
        }
        requestData.updatedBy = ObjectId(req.userId);
        JobOpening.findByIdAndUpdate(JobOpeningId, requestData, { new: true }, function(err, JobOpeningDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, JobOpeningDetails, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to update JobOpening details by id in db
 */

module.exports.deleteByJobOpeningId = function(req, res) {

    try {

        if (!req.body.JobOpeningId) {
            return responseHandlier.errorResponse(false, "JobOpening Id is required.", res);
        }

        const JobOpeningId = req.body.JobOpeningId;
        const requestData = req.body;
        JobOpening.updateMany({ _id: { $in: JobOpeningId } }, requestData, { new: true }, function(err, JobOpeningDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, 'Successfully Updated', res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add JobOpening details in db
 */

module.exports.addJobOpeningApproval = async(req, res) => {
    try {
        let approvalDetails = req.body;

        let JobOpeningData = await JobOpening.findById(req.body.JobOpeningId);
        approvalDetails.insertedBy = ObjectId(req.userId);
        approvalDetails.insertedOn = new Date();
        approvalDetails.forwardDate = new Date();
        approvalDetails.approvedStatus = 1;
        approvalDetails.status = 1;
        approvalDetails.forwardBy = ObjectId(req.userId);


        JobOpening.findByIdAndUpdate(req.body.JobOpeningId, {
            $set: {
                Approvals: [...JobOpeningData.Approvals, approvalDetails]
            }
        }, { new: true }, function(err, JobOpeningDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, JobOpeningDetails, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}

/**
 * @PUT
 * @param {*} req
 * @param {*} res
 * @returns to update approval by id
 */

module.exports.updateByApprovalsId = function(req, res) {

        try {

            if (!req.body.JobOpeningId) {
                return responseHandlier.errorResponse(false, "JobOpening Id is required.", res);
            }
            if (!req.body.approvals_id) {
                return responseHandlier.errorResponse(false, "Approvals Id is required.", res);
            }

            const JobOpeningId = {
                _id: ObjectId(req.body.JobOpeningId)
            };
            const requestData = {};
            if (req.body.approvedStatus) {
                requestData.$set = {
                    'Approvals.$.approvedStatus': req.body.approvedStatus,
                    'Approvals.$.updatedBy': ObjectId(req.userId),
                    'Approvals.$.updatedOn': new Date()
                }
            }

            JobOpening.updateOne({ _id: JobOpeningId, 'Approvals._id': req.body.approvals_id }, requestData, { "multi": true }, function(err, employeeDetails) {
                if (err) {
                    responseHandlier.errorResponse(false, err, res)
                } else {
                    responseHandlier.successResponse(true, employeeDetails, res);
                }
            });

        } catch (error) {
            return responseHandlier.errorResponse(false, error, res);
        }

    }
    /**
     * @POST
     * @param {*} req
     * @param {*} res
     * @returns to get Forward To JobOpening details in db
     */

module.exports.getAllJobOpeningsByForwardTo = (req, res) => {
    try {
        if (!req.body.forwardTo) {
            return responseHandlier.errorResponse(false, "forwardTo Id is required.", res);
        }

        JobOpening.find({ status: { $in: [1, 2] }, "Approvals.forwardTo": req.body.forwardTo }, (error, JobOpenings) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (JobOpenings) {
                responseHandlier.successResponse(true, JobOpenings, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to get Forward To JobOpening Summary in db
 */

module.exports.getAllJobOpeningsSummary = (req, res) => {
    try {
        let condition = {}
        if (req.body.JobOpeningId) {
            condition._id = ObjectId(req.body.JobOpeningId);
        }
        if (req.body.jobOpeningNumber) {
            condition.jobOpeningNumber = req.body.jobOpeningNumber;
        }
        if (req.body.companyId) {
            condition.companyId = ObjectId(req.body.companyId);
        }
        if (req.body.branchId) {
            condition.branchId = ObjectId(req.body.branchId);
        }
        if (req.body.departmentId) {
            condition.departmentId = ObjectId(req.body.departmentId);
        }
        if (req.body.designationId) {
            condition.designationId = ObjectId(req.body.designationId);
        }
        if (req.body.vacancyType) {
            condition.vacancyType = req.body.vacancyType;
        }
        if (req.body.pubStatus) {
            condition.pubStatus = req.body.pubStatus;
        }
        if (req.body.status) {
            condition.status = ObjectId(req.body.status);
        } else {
            condition.status = common.status.ACTIVE;
        }

        JobOpening.find(condition, (error, JobOpenings) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (JobOpenings) {
                responseHandlier.successResponse(true, JobOpenings, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}