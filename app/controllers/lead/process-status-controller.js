const ObjectId = require('mongodb').ObjectId;
const ProcessStatus = require('../../models/lead/process-status-model');
const responseHandlier = require('../../libs/response/status');
const common = require('../../libs/static/common');
const commonFunction = require('../../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add process status details in db
 */

module.exports.addProcessStatus = (req, res) => {
    try {

        const newProcessStatus = new ProcessStatus({
            processStatus: req.body.processStatus,
            shortCode: req.body.shortCode,
            description: req.body.description,
            colorCode: req.body.colorCode,
            status: common.status.ACTIVE,
            insertedBy: ObjectId(req.userId),
            updatedBy: ObjectId(req.userId)
        });

        newProcessStatus.save((error, processStatus) => {
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
 * @returns to get all process status details in db
 */

module.exports.getAllProcessStatus = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        ProcessStatus.find(filterObj, (error, processStatus) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (processStatus) {
                responseHandlier.successResponse(true, processStatus, res);
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
 * @returns to get process status details by id in db
 */

module.exports.getByProcessStatusId = (req, res) => {

    try {

        if (!req.query.processStatusId) {
            return responseHandlier.errorResponse(false, "Process status id is required.", res);
        }

        const processStatusId = {
            _id: ObjectId(req.query.processStatusId)
        };

        ProcessStatus.findOne(processStatusId, (error, processStatusDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (processStatusDetails) {
                responseHandlier.successResponse(true, processStatusDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid process status id', res);
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
 * @returns to update process status details by id
 */

module.exports.updateByProcessStatusId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Process status id is required.", res);
        }

        const processStatusId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        ProcessStatus.findByIdAndUpdate(processStatusId, requestData, { new: true }, function(err, processStatusDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, processStatusDetails, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}

/**
 * @DELETE
 * @param {*} req
 * @param {*} res
 * @returns to delete process status details by id in db
 */

module.exports.deleteByProcessStatusId = function(req, res) {

    try {

        if (!req.body.processStatusId) {
            return responseHandlier.errorResponse(false, "Process status id is required.", res);
        }

        const processStatusId = req.body.processStatusId;

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };

        ProcessStatus.updateMany({ _id: { $in: processStatusId } }, requestData, function(error, processStatusDetails) {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else {
                responseHandlier.successResponse(true, 'Successfully Updated', res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}