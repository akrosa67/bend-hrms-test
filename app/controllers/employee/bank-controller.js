const validator = require('validator');
const ObjectId = require('mongodb').ObjectId;
const { v4: uuidv4 } = require('uuid');
const Employee = require('../../models/employee-model');
const responseHandlier = require('../../libs/response/status');

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add employee details in db
 */

module.exports.addEmployeeBank = async(req, res) => {
    try {
        let bankDetails = req.body;
        bankDetails.is_default = false;

        let employeeData = await Employee.findById(req.body.emp_id)
        bankDetails.id = uuidv4()
        bankDetails.insertedBy = ObjectId(req.userId);
        bankDetails.insertedOn = new Date();
        bankDetails.status = 4;


        Employee.findByIdAndUpdate(req.body.emp_id, {
            $set: {
                bank: [...employeeData.bank, bankDetails]
            }
        }, { new: true }, function(err, employeeDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, employeeDetails, res);
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
 * @returns to get all bank details in db
 */

module.exports.getAllBank = (req, res) => {
    try {
        let query = {}
        if (req.body.emp_id) {
            query._id = req.body.emp_id;
        }
        query.status = 1;

        Employee.find(query, (error, employeeList) => {
            let data = [];
            if (employeeList.length > 0) {
                for (let i = 0; i < employeeList.length; i++) {
                    employeeList[i].bank.forEach(e => {
                        if (e.status != 3) {
                            data.push({
                                "id": e.id,
                                "bankName": e.bankName,
                                "branchName": e.branchName,
                                "ifsc": e.ifsc,
                                "accountName": e.accountName,
                                "accountNo": e.accountNo,
                                "type": e.type,
                                "is_default": e.is_default,
                                "status": e.status
                            })
                        }
                    })
                }
            }
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (data) {
                responseHandlier.successResponse(true, data, res);
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
 * @returns to get employee details by id in db
 */

module.exports.getByBankId = (req, res) => {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.bank_id) {
            return responseHandlier.errorResponse(false, "Bank Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };

        Employee.findOne(employeeId, (error, employeeDetails) => {
            let key = employeeDetails.bank.findIndex(e => e._id === req.body.bank_id);
            let data = employeeDetails.bank[key];
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (data) {
                responseHandlier.successResponse(true, data, res);
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
 * @returns to update employee details by id
 */

module.exports.updateByBankId = function(req, res) {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.bank_id) {
            return responseHandlier.errorResponse(false, "Bank Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };
        const requestData = {};
        if (req.body.status) {
            requestData.$set = {
                'bank.$.status': req.body.status,
                'bank.$.updatedOn': new Date()
            }
        }
        if (req.body.is_default) {
            if (req.body.is_default == 2) {
                requestData.$set = {
                    'bank.$.is_default': false,
                    'bank.$.updatedOn': new Date()
                }
            } else {
                requestData.$set = {
                    'bank.$.is_default': true,
                    'bank.$.updatedOn': new Date()
                }

            }

        }

        Employee.updateOne({ _id: req.body.emp_id, 'bank._id': req.body.bank_id }, requestData, { "multi": true }, function(err, employeeDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, employeeDetails, res);
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
 * @returns to update employee details by id
 */

module.exports.updateBank = function(req, res) {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.bank_id) {
            return responseHandlier.errorResponse(false, "Bank Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };
        const requestData = {};
        requestData.$set = {
            'bank.$.bankName': req.body.bankName,
            'bank.$.branchName': req.body.branchName,
            'bank.$.ifsc': req.body.ifsc,
            'bank.$.accountName': req.body.accountName,
            'bank.$.accountNo': req.body.accountNo,
            'bank.$.type': req.body.type,
            'bank.$.status': req.body.status,
            'bank.$.updatedOn': new Date(),
            'bank.$.updatedBy': ObjectId(req.userId)
        }


        Employee.updateOne({ _id: req.body.emp_id, 'bank._id': req.body.bank_id }, requestData, { "multi": true }, function(err, employeeDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, employeeDetails, res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}