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

module.exports.addEmployeeRefDetails = async (req, res) => {
    try {
        let reference = req.body;
        reference.is_verified = false;

        let employeeData = await Employee.findById(req.body.emp_id)
        reference.id = uuidv4()
        reference.insertedBy = ObjectId(req.userId);
        reference.insertedOn = new Date();
        reference.status = 4;


        Employee.findByIdAndUpdate(req.body.emp_id, {
            $set: {
                reference: [...employeeData.reference, reference]
            }
        }, { new: true }, function (err, employeeDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, reference, res);
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
 * @returns to get all Reference details in db
 */

module.exports.getAllRefDetails = (req, res) => {
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
                    employeeList[i].reference.forEach(e => {
                        if (e.status != 3) {
                            data.push({
                                "id": e.id,
                                "referenceName": e.relationName,
                                "referenceMobile": e.referenceMobile,
                                "referenceAddress": e.referenceAddress,
                                "is_verified": e.is_verified,
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
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to get all Reference details in db
 */

module.exports.getAllverRefDetails = (req, res) => {
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
                    employeeList[i].reference.forEach(e => {
                        if (e.is_verified && e.status != 3) {
                            data.push({
                                "id": e.id,
                                "referenceName": e.relationName,
                                "referenceMobile": e.referenceMobile,
                                "referenceAddress": e.referenceAddress,
                                "is_verified": e.is_verified,
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

module.exports.getByRefDetailsId = (req, res) => {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.ref_id) {
            return responseHandlier.errorResponse(false, "RefDetails Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };

        Employee.findOne(employeeId, (error, employeeDetails) => {
            let key = employeeDetails.reference.findIndex(e => e.id == req.body.ref_id);
            let data = employeeDetails.reference[key];
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

module.exports.updateByRefDetailsId = function (req, res) {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.ref_id) {
            return responseHandlier.errorResponse(false, "RefDetails Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };
        const requestData = {};
        if (req.body.status) {
            requestData.$set = {
                'reference.$.status': req.body.status,
                'reference.$.updatedOn': new Date()
            }
        }
        if (req.body.is_verified) {
            if (req.body.is_verified == 2) {
                requestData.$set = {
                    'reference.$.is_verified': false,
                    'reference.$.updatedOn': new Date(),
                    'reference.$.updatedBy': ObjectId(req.userId)
                }
            } else {
                requestData.$set = {
                    'reference.$.is_verified': true,
                    'reference.$.updatedOn': new Date(),
                    'reference.$.updatedBy': ObjectId(req.userId)
                }

            }

        }
        if (req.body.is_verified && req.body.status) {
            if (req.body.is_verified == 2) {
                requestData.$set = {
                    'reference.$.status': req.body.status,
                    'reference.$.is_verified': false,
                    'reference.$.updatedOn': new Date(),
                    'reference.$.updatedBy': ObjectId(req.userId)
                }
            } else {
                requestData.$set = {
                    'reference.$.status': req.body.status,
                    'reference.$.is_verified': true,
                    'reference.$.updatedOn': new Date(),
                    'reference.$.updatedBy': ObjectId(req.userId)
                }

            }
        }

        Employee.updateOne({ _id: req.body.emp_id, 'reference.id': req.body.ref_id }, requestData, { "multi": true }, function (err, employeeDetails) {
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

module.exports.updateRefDetails = function (req, res) {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.ref_id) {
            return responseHandlier.errorResponse(false, "RefDetails Id is required.", res);
        }

        const employeeId = {
            'reference._id': ObjectId(req.body.ref_id)
        };

        const requestData = {
            $set: {
                'reference.$.referenceName': req.body.reference_name,
                'reference.$.referenceMobile': req.body.reference_mobile,
                'reference.$.referenceAddress': req.body.reference_address,
                'reference.$.status': req.body.status,
                'reference.$.updatedBy': ObjectId(req.userId),
                'reference.$.updatedOn': new Date()
            }
        };

        Employee.findOneAndUpdate(employeeId, requestData,
            {
                fields: { reference: 1 },
                new: true
            }).exec(function (err, employeeDetails) {
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