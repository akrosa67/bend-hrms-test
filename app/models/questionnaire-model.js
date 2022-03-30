const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionnaireSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    designationId: {
        type: Schema.Types.ObjectId,
        ref: 'Designation',
        required: true
    },
    questionId: {
        type: Array,
    },
    status: {
        type: Number,
        required: true
    },
    insertedBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Questionnaire", QuestionnaireSchema);