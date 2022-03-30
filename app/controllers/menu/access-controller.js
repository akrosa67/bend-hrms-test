const ObjectId = require('mongodb').ObjectId;
const Access = require('../../models/menu/access-model');
const responseHandlier = require('../../libs/response/status');
const common = require('../../libs/static/common');
const commonFunction = require('../../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add access details in db
 */

module.exports.addAccess = (req, res) => {
    try {


        if (!req.body.accessName) {
            return responseHandlier.errorResponse(false, "Access name is required.", res);
        }

        let query = {
            accessName: req.body.accessName.toLowerCase()
        }

        Access.findOne(query, function(err, accessDetails) {

            if (err) {
                return responseHandlier.errorResponse(false, err, res);
            } else if (accessDetails) {
                return responseHandlier.errorResponse(false, "This access name has already been registered.", res);
            }

            let newAccess = new Access({
                accessName: req.body.accessName.toLowerCase(),
                accessDescription: req.body.accessDescription,
                status: common.status.ACTIVE,
                insertedBy: ObjectId(req.userId),
                updatedBy: ObjectId(req.userId)
            });

            newAccess.save((error, user) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res);
                } else {
                    responseHandlier.successResponse(true, 'Successfully Inserted', res);
                }
            });

        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }
}

/**
 * @GET
 * @param {*} req
 * @param {*} res
 * @returns to get all access details in db
 */

module.exports.getAllAccess = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        Access.find(filterObj, (error, accessList) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (accessList) {
                responseHandlier.successResponse(true, accessList, res);
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
 * @returns to get access details by id in db
 */

module.exports.getByAccessId = (req, res) => {

    try {

        if (!req.query.accessId) {
            return responseHandlier.errorResponse(false, "Access Id is required.", res);
        }

        const accessId = {
            _id: ObjectId(req.query.accessId)
        };

        Access.findOne(accessId, (error, accessDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (accessDetails) {
                responseHandlier.successResponse(true, accessDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid Access Id', res);
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
 * @returns to update access details by id
 */

module.exports.updateByAccessId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Access Id is required.", res);
        }

        const accessId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        Access.findByIdAndUpdate(accessId, requestData, { new: true }, function(err, accessDetails) {
            if (err) {
                responseHandlier.errorResponse(false, error, res)
            } else {
                responseHandlier.successResponse(true, accessDetails, res);
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
 * @returns to delete access details by id in db
 */

module.exports.deleteByAccessId = function(req, res) {

    try {

        if (!req.body.accessId) {
            return responseHandlier.errorResponse(false, "Access Id is required.", res);
        }

        const accessId = req.query.accessId;

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };

        Access.updateMany({ _id: { $in: accessId } }, requestData, function(error, accessDetails) {
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