"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sponsorSchema = new mongoose_1.Schema({
    tranId: {
        type: String,
        required: [true, 'Transaction ID is required'],
        ref: 'Payment',
    },
    churchId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Church',
        required: [true, 'Church ID is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative'],
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
sponsorSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const Sponsor = (0, mongoose_1.model)('Sponsor', sponsorSchema);
exports.default = Sponsor;
