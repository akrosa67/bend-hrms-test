const Question = require('../models/question-model');
const responseHandlier = require('../libs/response/status');
const ObjectId = require('mongodb').ObjectId;


/**
 * @POST
 * @param {*} req
 * @param {*} res
 * @returns to add Question details in db
 */

module.exports.addQuestion = (req, res) => {
    try {
        let questionDetails = req.body;
        questionDetails.insertedBy = ObjectId(req.userId);
        questionDetails.status = 1;
        const newQuestion = new Question(questionDetails);

        newQuestion.save((error, user) => {
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
 * @returns to get all Question details in db
 */

module.exports.getAllQuestions = (req, res) => {
    try {

        Question.find({ status: { $nin: [3] } }, (error, Questions) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (Questions) {
                responseHandlier.successResponse(true, Questions, res);
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
 * @returns to get Active Question details in db
 */

module.exports.getActiveQuestions = (req, res) => {
    try {

        Question.find({ status: 1 }, (error, Questions) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (Questions) {
                responseHandlier.successResponse(true, Questions, res);
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

module.exports.getByQuestionId = (req, res) => {

    try {

        if (!req.query.QuestionId) {
            return responseHandlier.errorResponse(false, "Question Id is required.", res);
        }

        const QuestionId = {
            _id: ObjectId(req.query.QuestionId)
        };

        Question.findOne(QuestionId, (error, QuestionDetails) => {
            if (error) {
                responseHandlier.errorResponse(false, error, res)
            } else if (QuestionDetails) {
                responseHandlier.successResponse(true, QuestionDetails, res);
            } else {
                responseHandlier.errorResponse(true, 'Please provide the valid Question Id', res);
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

module.exports.updateByQuestionId = function(req, res) {

    try {

        if (!req.body._id) {
            return responseHandlier.errorResponse(false, "Question Id is required.", res);
        }

        const QuestionId = {
            _id: ObjectId(req.body._id)
        };

        const requestData = req.body;
        requestData.updatedBy = ObjectId(req.userId);
        Question.findByIdAndUpdate(QuestionId, requestData, { new: true }, function(err, QuestionDetails) {
            if (err) {
                responseHandlier.errorResponse(false, err, res)
            } else {
                responseHandlier.successResponse(true, QuestionDetails, res);
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
 * @returns to update Question details by id in db
 */

module.exports.deleteByQuestionId = function(req, res) {

    try {

        if (!req.body.QuestionId) {
            return responseHandlier.errorResponse(false, "Question Id is required.", res);
        }

        const QuestionId = req.body.QuestionId;
        const requestData = req.body;
        Question.updateMany({ _id: { $in: QuestionId } }, requestData, { new: true }, function(err, QuestionDetails) {
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