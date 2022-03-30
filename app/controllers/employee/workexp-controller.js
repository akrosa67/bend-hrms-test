const validator = require('validator');
const ObjectId = require('mongodb').ObjectId;
const { v4: uuidv4 } = require('uuid');
const Employee = require('../../models/employee-model');
const responseHandlier = require('../../libs/response/status');
const common = require('../../libs/static/common');

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add employee Work Exp in db
 */

module.exports.addEmployeeWorkExp = async(req, res) => {
    try {
        let workExpDetails = req.body;

        let employeeData = await Employee.findById(req.body.emp_id)
        workExpDetails.insertedBy = ObjectId(req.userId);
        workExpDetails.insertedOn = new Date();
        workExpDetails.status = 1;


        Employee.findByIdAndUpdate(req.body.emp_id, {
            $set: {
                workExp: [...employeeData.workExp, workExpDetails]
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
 * @returns to get all workExp details in db
 */

module.exports.getAllWorkExp = (req, res) => {
    try {
        let query = {}
        if (req.body.emp_id) {
            query._id = req.body.emp_id;
        }
        query.status = common.status.ACTIVE;

        Employee.find(query, (error, employeeList) => {
            let data = [];
            if (employeeList.length > 0) {
                for (let i = 0; i < employeeList.length; i++) {
                    employeeList[i].workExp.forEach(e => {
                        if (e.status != 3) {
                            data.push({
                                "id": e._id,
                                "companyName": e.companyName,
                                "designation": e.designation,
                                "fromDate": e.fromDate,
                                "toDate": e.toDate,
                                "totalExp": e.totalExp,
                                "description": e.description,
                                "attachments": e.attachments,
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
 * @returns to get employee Work Exp by id in db
 */

module.exports.getByWorkExpId = (req, res) => {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.workExp_id) {
            return responseHandlier.errorResponse(false, "WorkExp Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };

        Employee.findOne(employeeId, (error, employeeDetails) => {
            let work_exp = employeeDetails.workExp;
            let key = work_exp.findIndex(e => e._id === ObjectId(req.body.workExp_id));
            let data = employeeDetails.workExp[key];
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (data) {
                responseHandlier.successResponse(true, data, res);
            } else {
                responseHandlier.errorResponse(true, 'No data Found', res);
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
 * @returns to update employee Work Exp by id
 */

module.exports.updateByWorkExpId = function(req, res) {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.workExp_id) {
            return responseHandlier.errorResponse(false, "WorkExp Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };
        const requestData = {};
        requestData.$set = {
            'workExp.$.companyName': req.body.companyName,
            'workExp.$.designation': req.body.designation,
            'workExp.$.fromDate': req.body.fromDate,
            'workExp.$.toDate': req.body.toDate,
            'workExp.$.totalExp': req.body.totalExp,
            'workExp.$.description': req.body.description,
            'workExp.$.attachments': req.body.attachments,
            'workExp.$.status': req.body.status,
            'workExp.$.updatedOn': new Date(),
            'workExp.$.updatedBy': ObjectId(req.userId)
        }

        Employee.updateOne({ _id: req.body.emp_id, 'workExp._id': req.body.workExp_id }, requestData, { "multi": true }, function(err, employeeDetails) {
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
 * @returns to update employee Work Exp by id
 */

module.exports.deleteByWorkExpId = function(req, res) {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.workExp_id) {
            return responseHandlier.errorResponse(false, "WorkExp Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };
        const requestData = {};
        if (req.body.status) {
            requestData.$set = {
                'workExp.$.status': req.body.status,
                'workExp.$.updatedOn': new Date()
            }
        }

        Employee.updateOne({ _id: req.body.emp_id, 'workExp._id': req.body.workExp_id }, requestData, { "multi": true }, function(err, employeeDetails) {
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