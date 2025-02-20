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
exports.codeController = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const codeGenerator_service_1 = require("./codeGenerator.service");
const createCodes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { churchId, numOfCodes } = req.body;
    if (!userId || !churchId || !numOfCodes || numOfCodes <= 0) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: 'Invalid input',
            data: {},
        });
    }
    const codes = yield codeGenerator_service_1.codeService.createCodes(userId, churchId, numOfCodes);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: `${numOfCodes} codes generated successfully`,
        data: codes,
    });
});
const validateCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = req.user?.userId;
    const { code } = req.body;
    if (!code) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: 'Invalid input',
            data: {},
        });
    }
    const isValid = yield codeGenerator_service_1.codeService.validateCode(code);
    if (isValid) {
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Code validated successfully',
            data: {},
        });
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: 'Invalid or already used code',
            data: {},
        });
    }
});
exports.codeController = {
    createCodes,
    validateCode,
};
