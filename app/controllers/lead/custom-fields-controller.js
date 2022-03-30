const ObjectId = require('mongodb').ObjectId;
const CustomField = require('../../models/lead/custom-fields-model');
const leadService = require('../../models/lead/lead-service-model');
const responseHandlier = require('../../libs/response/status');
const common = require('../../libs/static/common');
const commonFunction = require('../../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add custom field details in db
 */

module.exports.addCustomField = (req, res) => {
    try {

        const newCustomField = new CustomField({
            serviceId: req.body.serviceId,
            labelName: req.body.labelName,
            datatype: req.body.datatype,
            helptext: req.body.helptext,
            defaultValue: req.body.defaultValue,
            isMandatory: req.body.isMandatory,
            status: common.status.ACTIVE,
            insertedBy: ObjectId(req.userId),
            updatedBy: ObjectId(req.userId)
        });

        newCustomField.save(async(error, customField) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res);
            } else {

                const filter = { _id: customField.serviceId };

                const update = {
                    $push: { customs: customField._id }
                };

                // Update custom fields-id in lead service table

                await leadService.findOneAndUpdate(filter, update);

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
 * @returns to get all custom fields details in db
 */

module.exports.getAllCustomField = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        CustomField.find(filterObj, (error, customField) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (customField) {
                responseHandlier.successResponse(true, customField, res);
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
 * @returns to get custom field details by id in db
 */

module.exports.getByCustomFieldId = (req, res) => {

    try {

        if (!req.query.customFieldId) {
            return responseHandlier.errorResponse(false, "Custom field id is required.", res);
        }

        const customFieldId = {
            _id: ObjectId(req.query.customFieldId)
        };

        CustomField.findOne(customFieldId, (error, customFieldDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (customFieldDetails) {
                responseHandlier.successResponse(true, customFieldDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid custom field id', res);
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
 * @returns to update custom field details by id
 */

module.exports.updateByCustomFieldId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Custom field id is required.", res);
        }

        const customFieldId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        CustomField.findByIdAndUpdate(customFieldId, requestData, { new: true }, function(err, customFieldDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, customFieldDetails, res);
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
 * @returns to delete custom field details by id in db
 */

module.exports.deleteByCustomFieldId = function(req, res) {

    try {

        if (!req.body.customFieldId) {
            return responseHandlier.errorResponse(false, "Custom field id is required.", res);
        }

        const customFieldId = req.body.customFieldId;

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };

        CustomField.updateMany({ _id: { $in: customFieldId } }, requestData, function(error, customFieldDetails) {
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