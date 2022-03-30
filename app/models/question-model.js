const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    option1: {
        type: String,
        required: true
    },
    option2: {
        type: String,
        required: true
    },
    option3: {
        type: String,
        required: false
    },
    option4: {
        type: String,
        required: false
    },
    udf1: {
        type: String,
        required: false
    },
    udf2: {
        type: String,
        required: false
    },
    udf3: {
        type: String,
        required: false
    },
    method: {
        type: String,
        enum: ["Options", "Descriptions"]
    },
    type: {
        type: String,
        enum: ["General", "Technical"]
    },
    answer: {
        type: String,
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

module.exports = mongoose.model("Question", QuestionSchema);