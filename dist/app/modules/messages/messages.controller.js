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
exports.messageController = void 0;
const messages_service_1 = require("./messages.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { receiver, message } = req.body;
    const sender = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!sender) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: 'User not authenticated',
            data: {},
        });
    }
    try {
        const result = yield messages_service_1.messageService.sendMessage(sender, receiver, message);
        const io = global === null || global === void 0 ? void 0 : global.socketio;
        if (io) {
            io.to(receiver.toString()).emit('message::received', result);
        }
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Message sent successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: 'User not authenticated',
            data: {},
        });
    }
});
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { receiver } = req.params;
    const sender = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!sender) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: 'User not authenticated',
            data: {},
        });
    }
    try {
        const result = yield messages_service_1.messageService.getMessages(sender, receiver);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: 'Messages fetched successfully',
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: 'User not authenticated',
            data: {},
        });
    }
});
exports.messageController = {
    sendMessage,
    getMessages,
};
