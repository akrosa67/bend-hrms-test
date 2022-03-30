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

module.exports.addEmployeeReciDoc = async(req, res) => {
    try {
        let recidocDetails = req.body;
        recidocDetails.mode = "Received Doc";

        if (!req.body.filename) {
            return responseHandlier.response(false, " File is required.", res);
        }
        let employeeData = await Employee.findById(req.body.emp_id)
        recidocDetails.id = uuidv4()
        recidocDetails.insertedBy = ObjectId(req.userId);
        recidocDetails.insertedOn = new Date();
        recidocDetails.status = 4;


        Employee.findByIdAndUpdate(req.body.emp_id, {
            $set: {
                kyc_received_documents: [...employeeData.kyc_received_documents, recidocDetails]
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
 * @returns to get all kyc details in db
 */

module.exports.getAllRecDoc = (req, res) => {
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
                    employeeList[i].kyc_received_documents.forEach(e => {
                        // let docData = Document.findById(e.docId)
                        if (e.mode != 'KYC' && e.status != 3) {
                            data.push({
                                "id": e.id,
                                "mode": e.mode,
                                "docId": e.docId,
                                // "doc_name":docData.documentName,
                                "filename": e.filename,
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

module.exports.getByRecDocId = (req, res) => {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.rec_doc_id) {
            return responseHandlier.errorResponse(false, "Received Doc Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };

        Employee.findOne(employeeId, (error, employeeDetails) => {
            let key = employeeDetails.kyc_received_documents.findIndex(e => e._id === req.body.rec_doc_id);
            let data = employeeDetails.kyc_received_documents[key];
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

module.exports.updateByRecDocId = function(req, res) {

    try {

        if (!req.body.emp_id) {
            return responseHandlier.errorResponse(false, "Employee Id is required.", res);
        }
        if (!req.body.rec_doc_id) {
            return responseHandlier.errorResponse(false, "Received Doc Id is required.", res);
        }

        const employeeId = {
            _id: ObjectId(req.body.emp_id)
        };


        const requestData = {
            $set: {
                'kyc_received_documents.$.status': req.body.status,
                'kyc_received_documents.$.updatedOn': new Date()
            }
        }

        Employee.updateOne({ _id: req.body.emp_id, 'kyc_received_documents._id': req.body.rec_doc_id }, requestData, { "multi": true }, function(err, employeeDetails) {
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