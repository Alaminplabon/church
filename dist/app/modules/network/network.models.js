"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const networkSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    messages: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Message',
        },
    ],
}, {
    timestamps: true,
});
const Network = (0, mongoose_1.model)('Network', networkSchema);
exports.default = Network;
