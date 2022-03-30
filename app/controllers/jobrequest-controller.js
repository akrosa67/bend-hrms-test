const JobRequest = require('../models/jobrequest-model');
const responseHandlier = require('../libs/response/status');
const ObjectId = require('mongodb').ObjectId;
const commonFunction = require('../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add JobRequest details in db
 */

module.exports.addJobRequest = async(req, res) => {
    try {
        let jobrequestDetails = req.body;
        let jobRequestData = await JobRequest.findOne({ status: { $in: [1, 2] } }, ).sort({ createdAt: -1 });
        jobrequestDetails.jobReqNumber = (jobRequestData === null) ? 'JR_00001' : await commonFunction.incrementString(jobRequestData.jobReqNumber);
        jobrequestDetails.insertedBy = ObjectId(req.userId);
        jobrequestDetails.status = 1;
        const newJobRequest = new JobRequest(jobrequestDetails);

        newJobRequest.save((error, user) => {
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
 * @returns to get all JobRequest details in db
 */

module.exports.getAllJobRequests = (req, res) => {
    try {

        JobRequest.find({ status: { $in: [1, 2] } }, (error, JobRequests) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (JobRequests) {
                responseHandlier.successResponse(true, JobRequests, res);
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
 * @returns to get Active JobRequest details in db
 */

module.exports.getActiveJobRequests = (req, res) => {
    try {

        JobRequest.find({ status: 1 }, (error, JobRequests) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (JobRequests) {
                responseHandlier.successResponse(true, JobRequests, res);
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

module.exports.getByJobRequestId = (req, res) => {

    try {

        if (!req.body.JobRequestId) {
            return responseHandlier.errorResponse(false, "JobRequest Id is required.", res);
        }

        const JobRequestId = {
            _id: ObjectId(req.body.JobRequestId)
        };

        JobRequest.findOne(JobRequestId, (error, JobRequestDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (JobRequestDetails) {
                responseHandlier.successResponse(true, JobRequestDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid JobRequest Id', res);
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
 * @returns to update jobrequest details by id
 */

module.exports.updateByJobRequestId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "JobRequest Id is required.", res);
        }

        const JobRequestId = {
            _id: ObjectId(req.body._id)
        };

        const requestData = req.body;
        requestData.updatedBy = ObjectId(req.userId);
        JobRequest.findByIdAndUpdate(JobRequestId, requestData, { new: true }, function(err, JobRequestDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, JobRequestDetails, res);
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
 * @returns to update JobRequest details by id in db
 */

module.exports.deleteByJobRequestId = function(req, res) {

    try {

        if (!req.body.JobRequestId) {
            return responseHandlier.errorResponse(false, "JobRequest Id is required.", res);
        }

        const JobRequestId = req.body.JobRequestId;
        const requestData = req.body;
        JobRequest.updateMany({ _id: { $in: JobRequestId } }, requestData, { new: true }, function(err, JobRequestDetails) {
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
 * @returns to add JobRequest details in db
 */

module.exports.addJobRequestApproval = async(req, res) => {
    try {
        let approvalDetails = req.body;

        let JobRequestData = await JobRequest.findById(req.body.JobRequestId);
        approvalDetails.insertedBy = ObjectId(req.userId);
        approvalDetails.insertedOn = new Date();
        approvalDetails.forwardDate = new Date();
        approvalDetails.approvedStatus = 1;
        approvalDetails.status = 1;
        approvalDetails.forwardBy = ObjectId(req.userId);


        JobRequest.findByIdAndUpdate(req.body.JobRequestId, {
            $set: {
                Approvals: [...JobRequestData.Approvals, approvalDetails]
            }
        }, { new: true }, function(err, JobRequestDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, JobRequestDetails, res);
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

            if (!req.body.JobRequestId) {
                return responseHandlier.errorResponse(false, "JobRequest Id is required.", res);
            }
            if (!req.body.approvals_id) {
                return responseHandlier.errorResponse(false, "Approvals Id is required.", res);
            }

            const JobRequestId = {
                _id: ObjectId(req.body.JobRequestId)
            };
            const requestData = {};
            if (req.body.approvedStatus) {
                requestData.$set = {
                    'Approvals.$.approvedStatus': req.body.approvedStatus,
                    'Approvals.$.updatedBy': ObjectId(req.userId),
                    'Approvals.$.updatedOn': new Date()
                }
            }

            JobRequest.updateOne({ _id: JobRequestId, 'Approvals._id': req.body.approvals_id }, requestData, { "multi": true }, function(err, employeeDetails) {
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
     * @returns to get Forward To JobRequest details in db
     */

module.exports.getAllJobRequestsByForwardTo = (req, res) => {
    try {
        if (!req.body.forwardTo) {
            return responseHandlier.errorResponse(false, "forwardTo Id is required.", res);
        }

        JobRequest.find({ status: { $in: [1, 2] }, "Approvals.forwardTo": req.body.forwardTo }, (error, JobRequests) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (JobRequests) {
                responseHandlier.successResponse(true, JobRequests, res);
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
 * @returns to get Forward To JobRequest Summary in db
 */

module.exports.getAllJobRequestsSummary = (req, res) => {
    try {
        let condition = {}
        if (req.body.jobRequestId) {
            condition._id = ObjectId(req.body.jobRequestId);
        }
        if (req.body.jobReqNumber) {
            condition.jobReqNumber = req.body.jobReqNumber;
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
        if (req.body.status) {
            condition.status = ObjectId(req.body.status);
        } else {
            condition.status = common.status.ACTIVE;
        }

        JobRequest.find(condition, (error, JobRequests) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (JobRequests) {
                responseHandlier.successResponse(true, JobRequests, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}