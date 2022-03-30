const ObjectId = require('mongodb').ObjectId;
const Department = require('../models/department-model');
const Designation = require('../models/designation-model');
const Employee = require('../models/employee-model');
const responseHandlier = require('../libs/response/status');
const common = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add department details in db
 */

module.exports.addDepartment = (req, res) => {
    try {

        let newDepartment = new Department({
            name: req.body.name,
            code: req.body.code,
            status: common.status.ACTIVE,
            insertedBy: ObjectId(req.userId),
            updatedBy: ObjectId(req.userId)
        });

        newDepartment.save((error, department) => {
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
 * @returns to get all department details in db
 */

module.exports.getAllDepartments = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        Department.find(filterObj)
            .populate({ path: 'designations', select: ['_id', 'name', 'code'] })
            .exec((error, companies) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (companies) {
                    responseHandlier.successResponse(true, companies, res);
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
 * @returns to get department details by id in db
 */

module.exports.getByDepartmentId = (req, res) => {

    try {

        if (!req.query.departmentId) {
            return responseHandlier.errorResponse(false, "Department Id is required.", res);
        }

        const departmentId = {
            _id: ObjectId(req.query.departmentId)
        };

        Department.findOne(departmentId)
            .populate({ path: 'designations', select: ['_id', 'name', 'code'] })
            .exec((error, departmentDetails) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (departmentDetails) {
                    responseHandlier.successResponse(true, departmentDetails, res);
                } else {
                    responseHandlier.errorResponse(true, 'Please provide the valid Department Id', res);
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
 * @returns to update department details by id
 */

module.exports.updateByDepartmentId = function (req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Department Id is required.", res);
        }

        const departmentId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        Department.findByIdAndUpdate(departmentId, requestData, { new: true }, function (err, departmentDetails) {
            if (err) {
                responseHandlier.errorResponse(false, error, res)
            } else {
                responseHandlier.successResponse(true, departmentDetails, res);
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
 * @returns to delete department details by id in db
 */

module.exports.deleteByDepartmentId = async function (req, res) {

    try {

        if (!req.body.departmentId) {
            return responseHandlier.errorResponse(false, " Department Id is required.", res);
        }

        const departmentId = req.body.departmentId;

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };

        let DeptIdData = [];
        let nonDeptIdData = [];
        for (let i = 0; i < departmentId.length; i++) {
            let employeeData = await Employee.find({ departmentId: ObjectId(departmentId[i]) });
            let designationData = await Designation.find({ departmentId: ObjectId(departmentId[i]) });

            if (employeeData.length > 0 || designationData.length > 0) {
                nonDeptIdData.push(departmentId[i]);
            } else {
                DeptIdData.push(departmentId[i]);
            }
        }
        let data = [{ "UpdatedData": DeptIdData, "NonUpdatedData": nonDeptIdData }];

        Department.updateMany({ _id: { $in: DeptIdData } }, requestData, function (err, departmentDetails) {
            if (err) {
                responseHandlier.errorResponse(false, error, res)
            } else {
                responseHandlier.successResponse(true, data, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}