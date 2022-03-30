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

module.exports.addEmployeeHike = async(req, res) => {
    try {
        let hikeDetails = req.body;

        let employeeData = await Employee.findById(req.body.emp_id);
        hikeDetails.insertedBy = ObjectId(req.userId);
        hikeDetails.insertedOn = new Date();
        hikeDetails.status = 1;


        Employee.findByIdAndUpdate(req.body.emp_id, {
            $set: {
                hike: [...employeeData.hike, hikeDetails]
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
 * @returns to get all hike details in db
 */

module.exports.getAllHike = (req, res) => {
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
                    employeeList[i].hike.forEach(e => {
                        if (e.status != 3) {
                            data.push({
                                "_id": e._id,
                                "hikedate": e.hikedate,
                                "hikeamount": e.hikeamount,
                                "hike_per": e.hike_per,
                                "current_salary": e.current_salary,
                                "hiked_salary": e.hiked_salary,
                                "notes": e.notes,
                                "nhike_tenure": e.nhike_tenure,
                                "nhikedate": e.nhikedate,
                                "nhikeamount": e.nhikeamount,
                                "nhike_per": e.nhike_per,
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
 * @returns to get all hike details in db
 */

module.exports.getAllHikeProcessed = (req, res) => {
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
                    employeeList[i].hike.forEach(e => {
                        if (e.status == 1) {
                            data.push({
                                "_id": e._id,
                                "hikedate": e.hikedate,
                                "hikeamount": e.hikeamount,
                                "hike_per": e.hike_per,
                                "current_salary": e.current_salary,
                                "hiked_salary": e.hiked_salary,
                                "notes": e.notes,
                                "nhike_tenure": e.nhike_tenure,
                                "nhikedate": e.nhikedate,
                                "nhikeamount": e.nhikeamount,
                                "nhike_per": e.nhike_per,
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
 * @returns to get all hike details in db
 */

module.exports.getAllHikeCommitment = (req, res) => {
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
                    employeeList[i].hike.forEach(e => {
                        if (e.status == 1) {
                            data.push({
                                "_id": e._id,
                                "hikedate": e.hikedate,
                                "hikeamount": e.hikeamount,
                                "hike_per": e.hike_per,
                                "current_salary": e.current_salary,
                                "hiked_salary": e.hiked_salary,
                                "notes": e.notes,
                                "nhike_tenure": e.nhike_tenure,
                                "nhikedate": e.nhikedate,
                                "nhikeamount": e.nhikeamount,
                                "nhike_per": e.nhike_per,
                                "status": e.status,
                                "insertedOn": e.insertedOn

                            })
                        }
                    })
                }
            }
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (data) {
                var sorted = data.sort(function(a, b) {
                    return b.insertedOn - a.insertedOn;
                });
                responseHandlier.successResponse(true, sorted, res);
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

module.exports.getByHikeId = (req, res) => {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.hike_id) {
            return responseHandlier.errorResponse(false, "Hike Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };

        Employee.findOne(employeeId, (error, employeeDetails) => {
            let key = employeeDetails.hike.findIndex(e => e.id === req.body.hike_id);
            let data = employeeDetails.hike[key];
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

module.exports.updateByHikeId = function(req, res) {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.hike_id) {
            return responseHandlier.errorResponse(false, "Hike Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };
        const requestData = {};
        if (req.body.status) {
            requestData.$set = {
                'hike.$.status': req.body.status,
                'hike.$.updatedOn': new Date()
            }
        }
        if (req.body.is_default) {
            if (req.body.is_default == 2) {
                requestData.$set = {
                    'hike.$.is_default': false,
                    'hike.$.updatedOn': new Date()
                }
            } else {
                requestData.$set = {
                    'hike.$.is_default': true,
                    'hike.$.updatedOn': new Date()
                }

            }

        }

        Employee.updateOne({ _id: req.body.emp_id, 'hike._id': req.body.hike_id }, requestData, { "multi": true }, function(err, employeeDetails) {
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