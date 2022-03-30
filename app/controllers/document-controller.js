const Document = require('../models/document-model');
const Employee = require('../models/employee-model');
const responseHandlier = require('../libs/response/status');
const ObjectId = require('mongodb').ObjectId;


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add Document details in db
 */

module.exports.addDocument = (req, res) => {
    try {
        let documentDetails = req.body;
        documentDetails.insertedBy = ObjectId(req.userId);
        documentDetails.status = 1;
        const newDocument = new Document(documentDetails);

        newDocument.save((error, user) => {
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
 * @returns to get all Document details in db
 */

module.exports.getAllDocuments = (req, res) => {
    try {

        Document.find({ status: { $nin: [3] } }, (error, Documents) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (Documents) {
                responseHandlier.successResponse(true, Documents, res);
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
 * @returns to get Active Document details in db
 */

module.exports.getActiveDocuments = (req, res) => {
    try {

        Document.find({ status: 1 }, (error, Documents) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (Documents) {
                responseHandlier.successResponse(true, Documents, res);
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

module.exports.getByDocumentId = (req, res) => {

    try {

        if (!req.query.DocumentId) {
            return responseHandlier.errorResponse(false, "Document Id is required.", res);
        }

        const DocumentId = {
            _id: ObjectId(req.query.DocumentId)
        };

        Document.findOne(DocumentId, (error, DocumentDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (DocumentDetails) {
                responseHandlier.successResponse(true, DocumentDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid Document Id', res);
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
 * @returns to update Document details by id
 */

module.exports.updateByDocumentId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Document Id is required.", res);
        }

        const DocumentId = {
            _id: ObjectId(req.body._id)
        };

        const requestData = req.body;
        requestData.updatedBy = ObjectId(req.userId);

        Document.findByIdAndUpdate(DocumentId, requestData, { new: true }, function(err, DocumentDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, DocumentDetails, res);
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
 * @returns to update Document details by id in db
 */

module.exports.deleteByDocumentId = async function(req, res) {

    try {

        if (!req.body.DocumentId) {
            return responseHandlier.errorResponse(false, "Document Id is required.", res);
        }

        const DocumentId = req.body.DocumentId;
        const requestData = req.body;
        let DocumentIdData = [];
        let nonDocumentIdData = [];
        for (let i = 0; i < DocumentId.length; i++) {
            let employeeData = await Employee.find({ kyc_received_documents: { $elemMatch: { "doc_id": ObjectId(DocumentId[i]) } } });

            if (employeeData.length > 0) {
                nonDocumentIdData.push(DocumentId[i]);
            } else {
                DocumentIdData.push(DocumentId[i]);
            }
        }
        let data = [{ "UpdatedData": DocumentIdData, "NonUpdatedData": nonDocumentIdData }];
        Document.updateMany({ _id: { $in: DocumentIdData } }, requestData, { new: true }, function(err, DocumentDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, data, res);
            }
        });

    } catch (error) {
        console.log(error);
        return responseHandlier.errorResponse(false, error, res);
    }

}