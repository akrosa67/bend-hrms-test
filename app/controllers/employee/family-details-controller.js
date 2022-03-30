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

module.exports.addEmployeeFamDetails = async(req, res) => {
    try {
        let FamDetails = req.body;
        FamDetails.is_verified = false;

        let employeeData = await Employee.findById(req.body.emp_id)
        FamDetails.id = uuidv4()
        FamDetails.insertedBy = ObjectId(req.userId);
        FamDetails.insertedOn = new Date();
        FamDetails.status = 4;


        Employee.findByIdAndUpdate(req.body.emp_id, {
            $set: {
                family_details: [...employeeData.family_details, FamDetails]
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
 * @returns to get all Family details in db
 */

module.exports.getAllFamDetails = (req, res) => {
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
                    employeeList[i].family_details.forEach(e => {
                        if (e.status != 3) {
                            data.push({
                                "id": e._id,
                                "relationName": e.relationName,
                                "relationship": e.relationship,
                                "relationMobile": e.relationMobile,
                                "relationAddress": e.relationAddress,
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
 * @returns to get all Family details in db
 */

module.exports.getAllverFamDetails = (req, res) => {
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
                    employeeList[i].family_details.forEach(e => {
                        if (e.is_verified && e.status != 3) {
                            data.push({
                                "id": e._id,
                                "relationName": e.relationName,
                                "relationship": e.relationship,
                                "relationMobile": e.relationMobile,
                                "relationAddress": e.relationAddress,
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

module.exports.getByFamDetailsId = (req, res) => {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.famDet_id) {
            return responseHandlier.errorResponse(false, "FamDetails Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };

        Employee.findOne(employeeId, (error, employeeDetails) => {
            let key = employeeDetails.family_details.findIndex(e => e._id === req.body.famDet_id);
            let data = employeeDetails.family_details[key];
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

module.exports.updateByFamDetailsId = function(req, res) {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.famDet_id) {
            return responseHandlier.errorResponse(false, "FamDetails Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };
        const requestData = {};
        if (req.body.status) {
            requestData.$set = {
                'family_details.$.status': req.body.status,
                'family_details.$.updatedOn': new Date()
            }
        }
        if (req.body.is_verified) {
            if (req.body.is_verified == 2) {
                requestData.$set = {
                    'family_details.$.is_verified': false,
                    'family_details.$.updatedOn': new Date()
                }
            } else {
                requestData.$set = {
                    'family_details.$.is_verified': true,
                    'family_details.$.updatedOn': new Date()
                }

            }

        }
        if (req.body.is_verified && req.body.status) {
            if (req.body.is_verified == 2) {
                requestData.$set = {
                    'family_details.$.status': req.body.status,
                    'family_details.$.is_verified': false,
                    'family_details.$.updatedOn': new Date()
                }
            } else {
                requestData.$set = {
                    'family_details.$.status': req.body.status,
                    'family_details.$.is_verified': true,
                    'family_details.$.updatedOn': new Date()
                }

            }
        }

        Employee.updateOne({ _id: req.body.emp_id, 'family_details._id': req.body.famDet_id }, requestData, { "multi": true }, function(err, employeeDetails) {
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

module.exports.updateFamDetails = function(req, res) {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.famDet_id) {
            return responseHandlier.errorResponse(false, "FamDetails Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };
        const requestData = {};
        requestData.$set = {
            'family_details.$.relationName': req.body.relationName,
            'family_details.$.relationship': req.body.relationship,
            'family_details.$.relationMobile': req.body.relationMobile,
            'family_details.$.relationAddress': req.body.relationAddress,
            'family_details.$.attachments': req.body.attachments,
            'family_details.$.status': req.body.status,
            'family_details.$.updatedOn': new Date(),
            'family_details.$.updatedBy': ObjectId(req.userId)
        }

        Employee.updateOne({ _id: req.body.emp_id, 'family_details._id': req.body.famDet_id }, requestData, { "multi": true }, function(err, employeeDetails) {
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