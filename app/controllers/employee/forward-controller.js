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

module.exports.addEmployeeForward = async(req, res) => {
    try {
        let forwardDetails = req.body;

        let employeeData = await Employee.findById(req.body.emp_id);
        forwardDetails.insertedBy = ObjectId(req.userId);
        forwardDetails.insertedOn = new Date();
        forwardDetails.forwarddate = new Date();
        forwardDetails.approvedstatus = 1;
        forwardDetails.status = 1;
        forwardDetails.forwardby = ObjectId(req.userId);


        Employee.findByIdAndUpdate(req.body.emp_id, {
            $set: {
                forward: [...employeeData.forward, forwardDetails]
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
 * @returns to get all forward details in db
 */

module.exports.getAllForward = (req, res) => {
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
                    employeeList[i].forward.forEach(e => {
                        if (e.status != 3) {
                            data.push({
                                "_id": e._id,
                                "forwarddate": e.forwarddate,
                                "forwardamount": e.forwardamount,
                                "forward_per": e.forward_per,
                                "current_salary": e.current_salary,
                                "forwardd_salary": e.forwardd_salary,
                                "notes": e.notes,
                                "nforward_tenure": e.nforward_tenure,
                                "nforwarddate": e.nforwarddate,
                                "nforwardamount": e.nforwardamount,
                                "nforward_per": e.nforward_per,
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

module.exports.getByForwardId = (req, res) => {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }


        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };
        var key;
        let data;
        Employee.findOne(employeeId, (error, employeeDetails) => {
            let forward = employeeDetails.forward;
            if (req.body.forward_id) {
                var filteredElements = forward.filter(function(item, index) {
                    key = index;
                    return item.id == req.body.forward_id;
                });
                data = filteredElements;
            }
            if (req.body.forwardto_id) {
                var filteredElements = forward.filter(function(item, index) {
                    key = index;
                    return item.forwardto == req.body.forwardto_id;
                });
                data = filteredElements;
            }
            if (req.body.forwardby_id) {
                var filteredElements = forward.filter(function(item, index) {
                    key = index;
                    return item.forwardby == req.body.forwardby_id;
                });
                data = filteredElements;
            }

            if (error) {
                responseHandlier.errorResponse(false, error, res)
            }
            if (data) {
                responseHandlier.successResponse(true, data, res);
            } else {
                responseHandlier.successResponse(true, 'No data Found', res);
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

module.exports.updateByForwardId = function(req, res) {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.forward_id) {
            return responseHandlier.errorResponse(false, "Forward Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };
        const requestData = {};
        if (req.body.status) {
            requestData.$set = {
                'forward.$.status': req.body.status,
                'forward.$.updatedOn': new Date()
            }
        }

        Employee.updateOne({ _id: req.body.emp_id, 'forward._id': req.body.forward_id }, requestData, { "multi": true }, function(err, employeeDetails) {
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