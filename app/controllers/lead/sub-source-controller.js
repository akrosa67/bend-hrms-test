const ObjectId = require('mongodb').ObjectId;
const SubSource = require('../../models/lead/sub-source-model');
const Source = require('../../models/lead/source-model');
const responseHandlier = require('../../libs/response/status');
const common = require('../../libs/static/common');
const commonFunction = require('../../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add sub sub source details in db
 */

module.exports.addSubSource = (req, res) => {
    try {
        const newSubSource = new SubSource({
            subSourceName: req.body.subSourceName,
            sourceId: req.body.sourceId,
            code: req.body.code,
            status: common.status.ACTIVE,
            insertedBy: ObjectId(req.userId),
            updatedBy: ObjectId(req.userId)
        });

        newSubSource.save(async(error, subSource) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res);
            } else {

                const filter = { _id: subSource.sourceId };

                const update = {
                    $push: { subSources: subSource._id }
                };

                // Update sub-Source-id in source table

                await Source.findOneAndUpdate(filter, update);

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
 * @returns to get all source details in db
 */

module.exports.getAllSubSources = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        SubSource.find(filterObj, (error, subSource) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (subSource) {
                responseHandlier.successResponse(true, subSource, res);
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
 * @returns to get source details by id in db
 */

module.exports.getBySubSourceId = (req, res) => {

    try {

        if (!req.query.subSourceId) {
            return responseHandlier.errorResponse(false, "Sub-source Id is required.", res);
        }

        const subSourceId = {
            _id: ObjectId(req.query.subSourceId)
        };

        SubSource.findOne(subSourceId, (error, subSourceDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (subSourceDetails) {
                responseHandlier.successResponse(true, subSourceDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid sub-source Id', res);
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
 * @returns to update sub-source details by id
 */

module.exports.updateBySubSourceId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Sub-source Id is required.", res);
        }

        const subSourceId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        SubSource.findByIdAndUpdate(subSourceId, requestData, { new: true }, function(err, subSourceDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, subSourceDetails, res);
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
 * @returns to delete sub-source details by id in db
 */

module.exports.deleteBySubSourceId = function(req, res) {

    try {

        if (!req.body.subSourceId) {
            return responseHandlier.errorResponse(false, "Sub-source Id is required.", res);
        }

        const subSourceId = req.body.subSourceId;

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };

        SubSource.updateMany({ _id: { $in: subSourceId } }, requestData, function(error, subSourceDetails) {
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