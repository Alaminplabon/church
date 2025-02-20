"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeService = void 0;
const mongoose_1 = require("mongoose");
const codeGenerator_models_1 = __importDefault(require("./codeGenerator.models"));
const generateCode = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};
const createCodes = (userId, churchId, numOfCodes) => __awaiter(void 0, void 0, void 0, function* () {
    const codes = [];
    for (let i = 0; i < numOfCodes; i++) {
        const code = generateCode(6); // Generate a 6-character code
        // Ensure the code is unique
        const existingCode = yield codeGenerator_models_1.default.findOne({ code });
        if (existingCode) {
            i--; // Retry if the code already exists
            continue;
        }
        const newCode = new codeGenerator_models_1.default({
            code,
            userId: new mongoose_1.Types.ObjectId(userId),
            churchId: new mongoose_1.Types.ObjectId(churchId),
            isUsed: false,
        });
        yield newCode.save();
        codes.push(newCode);
    }
    return codes;
});
const validateCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCode = yield codeGenerator_models_1.default.findOne({
        code,
        isUsed: false,
    });
    if (existingCode) {
        existingCode.isUsed = true;
        yield existingCode.save();
        return true;
    }
    return false;
});
exports.codeService = {
    createCodes,
    validateCode,
};
