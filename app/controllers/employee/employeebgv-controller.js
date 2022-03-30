const validator = require('validator');
const ObjectId = require('mongodb').ObjectId;
const { v4: uuidv4 } = require('uuid');
const Employee = require('../../models/employee-model');
const EmployeeBgv = require('../../models/employeebgv-model');
const responseHandlier = require('../../libs/response/status');

/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add EmployeeBgv details in db
 */

module.exports.addEmployeeBgv = (req, res) => {
    try {
        const newEmployeeBgv = new EmployeeBgv(req.body);
        newEmployeeBgv.insertedBy = ObjectId(req.userId);
        newEmployeeBgv.status = 1;

        newEmployeeBgv.save((error, user) => {
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
 * @returns to get all EmployeeBgv details in db
 */

module.exports.getAllEmployeeBgv = (req, res) => {
    try {
        let query = {}
        if (req.body.empId) {
            query.empId = req.body.empId;
        }
        if (req.body.assignedTo) {
            query.assignedTo = req.body.assignedTo;
        }
        query.status = { $nin: [3] };

        EmployeeBgv.find(query, (error, EmployeeBgv) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (EmployeeBgv) {
                responseHandlier.successResponse(true, EmployeeBgv, res);
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
 * @returns to get Active EmployeeBgv details in db
 */

module.exports.getActiveEmployeeBgv = (req, res) => {
    try {

        EmployeeBgv.find({ bgv_status: "Completed" }, (error, EmployeeBgv) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (EmployeeBgv) {
                responseHandlier.successResponse(true, EmployeeBgv, res);
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
 * @returns to get Active EmployeeBgv details in db
 */

module.exports.getEmployeeBgv = (req, res) => {
    try {

        let query = {}
        if (req.body.empId) {
            query._id = req.body.empId;
        }
        if (req.body.assignedTo) {
            query.assignedTo = req.body.assignedTo;
        }
        query.status = 1;

        EmployeeBgv.find({ bgv_status: "Completed" }, (error, EmployeeBgv) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (EmployeeBgv) {
                responseHandlier.successResponse(true, EmployeeBgv, res);
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

module.exports.getByEmployeeBgvId = (req, res) => {

    try {

        if (!req.query.EmployeeBgvId) {
            return responseHandlier.errorResponse(false, "EmployeeBgv Id is required.", res);
        }

        const EmployeeBgvId = {
            _id: ObjectId(req.query.EmployeeBgvId)
        };

        EmployeeBgv.findOne(EmployeeBgvId, (error, EmployeeBgvDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (EmployeeBgvDetails) {
                responseHandlier.successResponse(true, EmployeeBgvDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid EmployeeBgv Id', res);
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
 * @returns to update question details by id
 */

module.exports.updateByEmployeeBgvId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "EmployeeBgv Id is required.", res);
        }

        const EmployeeBgvId = {
            _id: ObjectId(req.body._id)
        };

        const requestData = req.body;
        requestData.updatedBy = ObjectId(req.userId);
        requestData.updatedAt = new Date();

        EmployeeBgv.findByIdAndUpdate(EmployeeBgvId, requestData, { new: true }, function(err, EmployeeBgvDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, EmployeeBgvDetails, res);
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
 * @returns to update question details by id
 */

module.exports.updateByEmployeeBgvDetailsId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "EmployeeBgv Id is required.", res);
        }

        const EmployeeBgvId = {
            _id: ObjectId(req.body._id)
        };

        const details = {
            id: uuidv4(),
            type: req.body.type,
            comments: req.body.comments,
            attachments: req.body.attachments,
            insertedBy: ObjectId(req.userId),
            insertedOn: new Date()
        };

        const requestData = {
            $push: {
                details
            }
        };

        EmployeeBgv.findByIdAndUpdate(EmployeeBgvId, requestData, { new: true }, function(err, EmployeeBgvDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, EmployeeBgvDetails, res);
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
 * @returns to update EmployeeBgv details by id in db
 */

module.exports.deleteByEmployeeBgvId = function(req, res) {

    try {

        if (!req.body.EmployeeBgvId) {
            return responseHandlier.errorResponse(false, "EmployeeBgv Id is required.", res);
        }

        const EmployeeBgvId = req.body.EmployeeBgvId;
        const requestData = req.body;
        requestData.status = 3;
        EmployeeBgv.findByIdAndUpdate(EmployeeBgvId, requestData, { new: true }, function(err, EmployeeBgvDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, 'Successfully Deleted', res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}