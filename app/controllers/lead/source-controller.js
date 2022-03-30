const ObjectId = require('mongodb').ObjectId;
const Source = require('../../models/lead/source-model');
const responseHandlier = require('../../libs/response/status');
const common = require('../../libs/static/common');
const commonFunction = require('../../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add source details in db
 */

module.exports.addSource = (req, res) => {
    try {

        const newSource = new Source({
            sourceName: req.body.sourceName,
            code: req.body.code,
            status: common.status.ACTIVE,
            insertedBy: ObjectId(req.userId),
            updatedBy: ObjectId(req.userId)
        });

        newSource.save((error, source) => {
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
 * @returns to get all source details in db
 */

module.exports.getAllSources = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        Source.find(filterObj)
            .populate('subSources')
            .exec((error, sources) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (sources) {
                    responseHandlier.successResponse(true, sources, res);
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

module.exports.getBySourceId = (req, res) => {

    try {

        if (!req.query.sourceId) {
            return responseHandlier.errorResponse(false, "Source Id is required.", res);
        }

        const sourceId = {
            _id: ObjectId(req.query.sourceId)
        };

        Source.findOne(sourceId)
            .populate('subSources')
            .exec((error, sourceDetails) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (sourceDetails) {
                    responseHandlier.successResponse(true, sourceDetails, res);
                } else {
                    responseHandlier.errorResponse(true, 'Please provide the valid source Id', res);
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
 * @returns to update source details by id
 */

module.exports.updateBySourceId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Source Id is required.", res);
        }

        const sourceId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        Source.findByIdAndUpdate(sourceId, requestData, { new: true }, function(err, sourceDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, sourceDetails, res);
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
 * @returns to delete source details by id in db
 */

module.exports.deleteBySourceId = function(req, res) {

    try {

        if (!req.body.sourceId) {
            return responseHandlier.errorResponse(false, "Source Id is required.", res);
        }

        const sourceId = req.body.sourceId;

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };

        Source.updateMany({ _id: { $in: sourceId } }, requestData, function(error, sourceDetails) {
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