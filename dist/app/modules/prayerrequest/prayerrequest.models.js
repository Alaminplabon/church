"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const prayerRequestSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    payerName: {
        type: String,
        required: [true, 'Payer name is required'],
    },
    churchId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Church',
        default: null,
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
        match: [/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:mm:ss)'],
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        match: [/^\d{2}:\d{2}:\d{2}$/, 'Invalid time format (HH:mm:ss)'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
prayerRequestSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const PrayerRequest = (0, mongoose_1.model)('PrayerRequest', prayerRequestSchema);
exports.default = PrayerRequest;
