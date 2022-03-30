const ObjectId = require('mongodb').ObjectId;
const Branch = require('../models/branch-model');
const Company = require('../models/company-model');
const Employee = require('../models/employee-model');
const responseHandlier = require('../libs/response/status');
const common = require('../libs/static/common');
const commonFunction = require('../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add branch details in db
 */

module.exports.addBranch = (req, res) => {
    try {
        const newBranch = new Branch({
            name: req.body.name,
            companyId: req.body.companyId,
            email: req.body.email,
            code: req.body.code,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            pincode: req.body.pincode,
            mobileNumber: req.body.mobileNumber,
            status: common.status.ACTIVE,
            address: req.body.address,
            insertedBy: ObjectId(req.userId),
            updatedBy: ObjectId(req.userId)
        });



        newBranch.save(async (error, branch) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res);
            } else {

                const filter = { _id: branch.companyId };

                const update = {
                    $push: { branches: branch._id }
                };

                // Update Company-id in source table

                await Company.findOneAndUpdate(filter, update);

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
 * @returns to get all branch details in db
 */

module.exports.getAllBranches = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        Branch.find(filterObj, (error, branches) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (branches) {
                responseHandlier.successResponse(true, branches, res);
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

module.exports.getByBranchId = (req, res) => {

    try {

        if (!req.query.branchId) {
            return responseHandlier.errorResponse(false, "Branch Id is required.", res);
        }

        const branchId = {
            _id: ObjectId(req.query.branchId)
        };

        Branch.findOne(branchId, (error, branchDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (branchDetails) {
                responseHandlier.successResponse(true, branchDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid branch Id', res);
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
 * @returns to update branch details by id
 */

module.exports.updateByBranchId = function (req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Branch Id is required.", res);
        }

        const branchId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        Branch.findByIdAndUpdate(branchId, requestData, { new: true }, function (err, branchDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, branchDetails, res);
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
 * @returns to delete branch details by id in db
 */

module.exports.deleteByBranchId = async function (req, res) {

    try {

        if (!req.body.branchId) {
            return responseHandlier.errorResponse(false, "Branch Id is required.", res);
        }

        const branchId = req.body.branchId;

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };

        let BranchIdData = [];
        let nonBranchIdData = [];
        for (let i = 0; i < branchId.length; i++) {
            let employeeData = await Employee.find({ branchId: ObjectId(branchId[i]) });

            if (employeeData.length > 0) {
                nonBranchIdData.push(branchId[i]);
            } else {
                BranchIdData.push(branchId[i]);
            }
        }
        let data = [{ "UpdatedData": BranchIdData, "NonUpdatedData": nonBranchIdData }];



        Branch.updateMany({ _id: { $in: BranchIdData } }, requestData, function (err, branchDetails) {
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