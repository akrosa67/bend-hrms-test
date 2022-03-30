const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const menuSchema = new Schema({
    menuName: {
        type: String,
        required: true
    },
    menukey: {
        type: String,
        required: true
    },
    menuType: {
        type: String,
        enum: ['menuHeader', 'menuSubHeader', 'menuItem'],
        default: 'menuHeader',
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    accMain: {
        type: Boolean,
        default: true,
        required: true
    },
    menuReferenceId: {
        type: Schema.Types.ObjectId,
        ref: 'Menu'
    },
    isNew: {
        type: Boolean,
        default: false,
        required: true
    },
    insertedBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Menu", menuSchema);