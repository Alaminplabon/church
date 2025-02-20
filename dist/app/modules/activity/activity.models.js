"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Activity title is required'],
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
activitySchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const Activity = (0, mongoose_1.model)('Activity', activitySchema);
exports.default = Activity;
