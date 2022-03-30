const Factor = require('../models/factor-model');
const responseHandlier = require('../libs/response/status');
const ObjectId = require('mongodb').ObjectId;


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add Factor details in db
 */

module.exports.addFactor = (req, res) => {
    try {
        let factorDetails = req.body;
        factorDetails.insertedBy = ObjectId(req.userId);
        factorDetails.status = 1;
        const newFactor = new Factor(factorDetails);

        newFactor.save((error, user) => {
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
 * @returns to get all Factor details in db
 */

module.exports.getAllFactors = (req, res) => {
    try {

        Factor.find({ status: { $nin: [3] } }, (error, Factors) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (Factors) {
                responseHandlier.successResponse(true, Factors, res);
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
 * @returns to get Active Factor details in db
 */

module.exports.getActiveFactors = (req, res) => {
    try {

        Factor.find({ status: 1 }, (error, Factors) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (Factors) {
                responseHandlier.successResponse(true, Factors, res);
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

module.exports.getByFactorId = (req, res) => {

    try {

        if (!req.query.FactorId) {
            return responseHandlier.errorResponse(false, "Factor Id is required.", res);
        }

        const FactorId = {
            _id: ObjectId(req.query.FactorId)
        };

        Factor.findOne(FactorId, (error, FactorDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (FactorDetails) {
                responseHandlier.successResponse(true, FactorDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid Factor Id', res);
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
 * @returns to update factor details by id
 */

module.exports.updateByFactorId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Factor Id is required.", res);
        }

        const FactorId = {
            _id: ObjectId(req.body._id)
        };

        const requestData = req.body;
        requestData.updatedBy = ObjectId(req.userId);
        Factor.findByIdAndUpdate(FactorId, requestData, { new: true }, function(err, FactorDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, FactorDetails, res);
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
 * @returns to update Factor details by id in db
 */

module.exports.deleteByFactorId = function(req, res) {

    try {

        if (!req.body.FactorId) {
            return responseHandlier.errorResponse(false, "Factor Id is required.", res);
        }

        const FactorId = req.body.FactorId;
        const requestData = req.body;
        Factor.updateMany({ _id: { $in: FactorId } }, requestData, { new: true }, function(err, FactorDetails) {
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