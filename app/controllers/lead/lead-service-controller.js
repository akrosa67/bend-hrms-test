const ObjectId = require('mongodb').ObjectId;
const LeadService = require('../../models/lead/lead-service-model');
const responseHandlier = require('../../libs/response/status');
const common = require('../../libs/static/common');
const commonFunction = require('../../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add lead service details in db
 */

module.exports.addLeadService = (req, res) => {
    try {

        const newLeadService = new LeadService({
            service: req.body.service,
            shortCode: req.body.shortCode,
            description: req.body.description,
            companyId: req.body.companyId,
            customs: req.body.customs,
            status: common.status.ACTIVE,
            insertedBy: ObjectId(req.userId),
            updatedBy: ObjectId(req.userId)
        });

        newLeadService.save((error, leadService) => {
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
 * @returns to get all lead service details in db
 */

module.exports.getAllLeadService = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        LeadService.find(filterObj, (error, leadService) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (leadService) {
                responseHandlier.successResponse(true, leadService, res);
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
 * @returns to get lead service details by id in db
 */

module.exports.getByLeadServiceId = (req, res) => {

    try {

        if (!req.query.leadServiceId) {
            return responseHandlier.errorResponse(false, "Lead service id is required.", res);
        }

        const leadServiceId = {
            _id: ObjectId(req.query.leadServiceId)
        };

        LeadService.findOne(leadServiceId, (error, leadServiceDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (leadServiceDetails) {
                responseHandlier.successResponse(true, leadServiceDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid lead service id', res);
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
 * @returns to update lead service details by id
 */

module.exports.updateByLeadServiceId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Lead service id is required.", res);
        }

        const leadServiceId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        LeadService.findByIdAndUpdate(leadServiceId, requestData, { new: true }, function(err, leadServiceDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, leadServiceDetails, res);
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
 * @returns to delete lead service details by id in db
 */

module.exports.deleteByLeadServiceId = function(req, res) {

    try {

        if (!req.body.leadServiceId) {
            return responseHandlier.errorResponse(false, "Lead service id is required.", res);
        }

        const leadServiceId = req.body.leadServiceId;

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };

        LeadService.updateMany({ _id: { $in: leadServiceId } }, requestData, function(error, leadServiceDetails) {
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