"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workSchema = new mongoose_1.Schema({
    workName: {
        type: String,
        required: [true, 'Work name is required'],
        unique: true,
    },
    description: {
        type: String,
        default: null,
    },
    images: [String],
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
workSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const Work = (0, mongoose_1.model)('Work', workSchema);
exports.default = Work;
