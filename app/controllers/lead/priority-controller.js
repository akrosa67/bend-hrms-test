const ObjectId = require('mongodb').ObjectId;
const Priority = require('../../models/lead/priority-model');
const responseHandlier = require('../../libs/response/status');
const common = require('../../libs/static/common');
const commonFunction = require('../../libs/util/commonFunctions');

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add process status details in db
 */

module.exports.addPriority = (req, res) => {
    try {

        const newPriority = new Priority({
            priority: req.body.priority,
            shortCode: req.body.shortCode,
            colorCode: req.body.colorCode,
            status: common.status.ACTIVE,
            insertedBy: ObjectId(req.userId),
            updatedBy: ObjectId(req.userId)
        });

        newPriority.save((error, priority) => {
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

module.exports.getAllPriority = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        Priority.find(filterObj, (error, priority) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (priority) {
                responseHandlier.successResponse(true, priority, res);
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

module.exports.getByPriorityId = (req, res) => {

    try {

        if (!req.query.priorityId) {
            return responseHandlier.errorResponse(false, "Process status id is required.", res);
        }

        const priorityId = {
            _id: ObjectId(req.query.priorityId)
        };

        Priority.findOne(priorityId, (error, priorityDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (priorityDetails) {
                responseHandlier.successResponse(true, priorityDetails, res);
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

module.exports.updateByPriorityId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Process status id is required.", res);
        }

        const priorityId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        Priority.findByIdAndUpdate(priorityId, requestData, { new: true }, function(err, priorityDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, priorityDetails, res);
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

module.exports.deleteByPriorityId = function(req, res) {

    try {

        if (!req.body.priorityId) {
            return responseHandlier.errorResponse(false, "Process status id is required.", res);
        }

        const priorityId = req.body.priorityId;

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };

        Priority.updateMany({ _id: { $in: priorityId } }, requestData, function(error, priorityDetails) {
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