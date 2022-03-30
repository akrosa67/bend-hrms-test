const ObjectId = require('mongodb').ObjectId;
const Designation = require('../models/designation-model');
const Department = require('../models/department-model');
const Employee = require('../models/employee-model');
const responseHandlier = require('../libs/response/status');
const common = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add designation details in db
 */

module.exports.addDesignation = (req, res) => {
    try {

        let newDesignation = new Designation({
            name: req.body.name,
            code: req.body.code,
            departmentId: req.body.departmentId,
            status: common.status.ACTIVE,
            insertedBy: ObjectId(req.userId),
            updatedBy: ObjectId(req.userId)
        });

        newDesignation.save(async(error, designation) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else {

                const filter = { _id: designation.departmentId };

                const update = {
                    $push: { designations: designation._id }
                };

                // Update Designation-id in source table

                await Department.findOneAndUpdate(filter, update);

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
 * @returns to get all designation details in db
 */

module.exports.getAllDesignations = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        Designation.find(filterObj, (error, designations) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (designations) {
                responseHandlier.successResponse(true, designations, res);
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
 * @returns to get Designation details by id in db
 */

module.exports.getByDesignationId = (req, res) => {

    try {

        if (!req.query.designationId) {
            return responseHandlier.errorResponse(false, "Designation Id is required.", res);
        }

        const designationId = {
            _id: ObjectId(req.query.designationId)
        };

        Designation.findOne(designationId, (error, designationDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (designationDetails) {
                responseHandlier.successResponse(true, designationDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid Designation Id', res);
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
 * @returns to update designation details by id
 */

module.exports.updateByDesignationId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Designation Id is required.", res);
        }

        const designationId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        Designation.findByIdAndUpdate(designationId, requestData, { new: true }, function(err, designationDetails) {
            if (err) {
                responseHandlier.errorResponse(false, error, res)
            } else {
                responseHandlier.successResponse(true, designationDetails, res);
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
 * @returns to delete designation details by id in db
 */

module.exports.deleteByDesignationId = async function(req, res) {

    try {

        if (!req.body.designationId) {
            return responseHandlier.errorResponse(false, " Designation Id is required.", res);
        }

        const designationId = req.body.designationId;

        const requestData = {
            $set: {
                status: common.status.DELETE,
                updatedBy: ObjectId(req.userId)
            }
        };

        let DesignationIdData = [];
        let nonDesignationIdData = [];
        for (let i = 0; i < designationId.length; i++) {
            let employeeData = await Employee.find({ designationId: ObjectId(designationId[i]) });

            if (employeeData.length > 0) {
                nonDesignationIdData.push(designationId[i]);
            } else {
                DesignationIdData.push(designationId[i]);
            }
        }
        let data = [{ "UpdatedData": DesignationIdData, "NonUpdatedData": nonDesignationIdData }];

        Designation.updateMany({ _id: { $in: DesignationIdData } }, requestData, function(err, designationDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, data, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}