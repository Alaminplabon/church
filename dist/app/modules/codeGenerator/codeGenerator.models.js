"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const codeGeneratorSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    churchId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Church', // Reference to the Church model
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const codeGenerator = (0, mongoose_1.model)('codeGenerator', codeGeneratorSchema);
exports.default = codeGenerator;
