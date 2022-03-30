const ObjectId = require('mongodb').ObjectId;
const Company = require('../models/company-model.js');
const responseHandlier = require('../libs/response/status');
const common = require('../libs/static/common');
const Employee = require('../models/employee-model');
const Branch = require('../models/branch-model');
const commonFunction = require('../libs/util/commonFunctions');


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add company details in db
 */

module.exports.addCompany = (req, res) => {
    try {

        let newCompany = new Company({
            name: req.body.name,
            code: req.body.code,
            status: common.status.ACTIVE,
            insertedBy: ObjectId(req.userId),
            updatedBy: ObjectId(req.userId)
        });

        newCompany.save((error, user) => {
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
 * @returns to get all company details in db
 */

module.exports.getAllCompanies = (req, res) => {
    try {

        const filterObj = commonFunction.filterObject(req);

        Company.find(filterObj)
            .populate({
                path: 'branches',
                select: [
                    '_id',
                    'name',
                    'code',
                    'address',
                    'city',
                    'state',
                    'country',
                    'pincode',
                    'mobileNumber',
                    'email']
            })
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
 * @returns to get company details by id in db
 */

module.exports.getByCompanyId = (req, res) => {

    try {

        if (!req.query.companyId) {
            return responseHandlier.errorResponse(false, "Company Id is required.", res);
        }

        const companyId = {
            _id: ObjectId(req.query.companyId)
        };

        Company.findOne(companyId)
            .populate({ path: 'branches', select: ['_id', 'name', 'code', 'address', 'city', 'state', 'country', 'pincode', 'mobileNumber', 'email'] })
            .exec((error, companyDetails) => {
                if (error) {
                    responseHandlier.errorResponse(false, error, res)
                } else if (companyDetails) {
                    responseHandlier.successResponse(true, companyDetails, res);
                } else {
                    responseHandlier.errorResponse(true, 'Please provide the valid company Id', res);
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
 * @returns to update company details by id
 */

module.exports.updateByCompanyId = function (req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Company Id is required.", res);
        }

        const companyId = {
            _id: ObjectId(req.body._id)
        };

        req.body.updatedBy = ObjectId(req.userId);

        const requestData = req.body;

        Company.findByIdAndUpdate(companyId, requestData, { new: true }, function (err, companyDetails) {
            if (err) {
                responseHandlier.errorResponse(false, error, res)
            } else {
                responseHandlier.successResponse(true, companyDetails, res);
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
 * @returns to delete Company details by id in db
 */

module.exports.deleteByCompanyId = async function (req, res) {

    try {

        if (!req.body.companyId) {
            return responseHandlier.errorResponse(false, " Company Id is required.", res);
        }

        const companyId = req.body.companyId;

        const requestData = {
            $set: {
                status: req.body.status,
                updatedBy: ObjectId(req.userId)
            }
        };

        let CompanyIdData = [];
        let nonCompanyIdData = [];
        for (let i = 0; i < companyId.length; i++) {
            let employeeData = await Employee.find({ companyId: ObjectId(companyId[i]) });
            let branchData = await Branch.find({ companyId: ObjectId(companyId[i]) });

            if (employeeData.length > 0 || branchData.length > 0) {
                nonCompanyIdData.push(companyId[i]);
            } else {
                CompanyIdData.push(companyId[i]);
            }
        }
        let data = [{ "UpdatedData": CompanyIdData, "NonUpdatedData": nonCompanyIdData }];

        Company.updateMany({ _id: { $in: CompanyIdData } }, requestData, function (err, companyDetails) {
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