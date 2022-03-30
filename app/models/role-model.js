const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        default: 'secondary',
        enum: ["primery", "secondary"]
    },
    permission: [
        {
            menuId: {
                type: Schema.Types.ObjectId,
                ref: 'Menu'
            },
            access: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Access'
                }
            ]
        }
    ],
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
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("Role", roleSchema);