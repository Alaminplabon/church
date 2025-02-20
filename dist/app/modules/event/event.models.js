"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Event Schema
const mongoose_1 = require("mongoose");
const locationSchema = new mongoose_1.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true },
});
const eventSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: locationSchema,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    bannerImage: [String],
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    churchId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Church',
        required: true,
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
eventSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const Event = (0, mongoose_1.model)('Event', eventSchema);
exports.default = Event;
