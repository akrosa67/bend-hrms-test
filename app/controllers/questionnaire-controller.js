const Questionnaire = require('../models/questionnaire-model');
const responseHandlier = require('../libs/response/status');
const ObjectId = require('mongodb').ObjectId;


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add Questionnaire details in db
 */

module.exports.addQuestionnaire = (req, res) => {
    try {
        let questionnaireDetails = req.body;
        questionnaireDetails.insertedBy = ObjectId(req.userId);
        questionnaireDetails.status = 1;
        const newQuestionnaire = new Questionnaire(questionnaireDetails);

        newQuestionnaire.save((error, user) => {
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
 * @returns to get all Questionnaire details in db
 */

module.exports.getAllQuestionnaires = (req, res) => {
    try {

        Questionnaire.find({ status: { $nin: [3] } }, (error, Questionnaires) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (Questionnaires) {
                responseHandlier.successResponse(true, Questionnaires, res);
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
 * @returns to get Active Questionnaire details in db
 */

module.exports.getActiveQuestionnaires = (req, res) => {
    try {

        Questionnaire.find({ status: 1 }, (error, Questionnaires) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (Questionnaires) {
                responseHandlier.successResponse(true, Questionnaires, res);
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

module.exports.getByQuestionnaireId = (req, res) => {

    try {

        if (!req.query.QuestionnaireId) {
            return responseHandlier.errorResponse(false, "Questionnaire Id is required.", res);
        }

        const QuestionnaireId = {
            _id: ObjectId(req.query.QuestionnaireId)
        };

        Questionnaire.findOne(QuestionnaireId, (error, QuestionnaireDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (QuestionnaireDetails) {
                responseHandlier.successResponse(true, QuestionnaireDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid Questionnaire Id', res);
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
 * @returns to update questionnairenaire details by id
 */

module.exports.updateByQuestionnaireId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Questionnaire Id is required.", res);
        }

        const QuestionnaireId = {
            _id: ObjectId(req.body._id)
        };

        const requestData = req.body;
        requestData.updatedBy = ObjectId(req.userId);
        Questionnaire.findByIdAndUpdate(QuestionnaireId, requestData, { new: true }, function(err, QuestionnaireDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, QuestionnaireDetails, res);
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
 * @returns to update Questionnaire details by id in db
 */

module.exports.deleteByQuestionnaireId = function(req, res) {

    try {

        if (!req.body.QuestionnaireId) {
            return responseHandlier.errorResponse(false, "Questionnaire Id is required.", res);
        }

        const QuestionnaireId = req.body.QuestionnaireId;
        const requestData = req.body;
        Questionnaire.updateMany({ _id: { $in: QuestionnaireId } }, requestData, { new: true }, function(err, QuestionnaireDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, 'Successfully Updated', res);
            }
        });

    } catch (error) {
        return responseHandlier.errorResponse(false, error, res);
    }

}