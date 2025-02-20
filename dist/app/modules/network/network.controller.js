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
exports.networkController = void 0;
const network_service_1 = require("./network.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const sendFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { receiver } = req.body;
    const sender = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!sender) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: 'User not authenticated',
            data: {},
        });
    }
    const result = yield network_service_1.networkService.sendFriendRequest(sender, receiver);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Friend request sent',
        data: result,
    });
});
const acceptFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { sender } = req.body;
    const receiver = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!receiver) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: 'User not authenticated',
            data: {},
        });
    }
    const result = yield network_service_1.networkService.acceptFriendRequest(sender, receiver);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Friend request accepted',
        data: result,
    });
});
const rejectFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { sender } = req.body;
    const receiver = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!receiver) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 400,
            success: false,
            message: 'User not authenticated',
            data: {},
        });
    }
    const result = yield network_service_1.networkService.rejectFriendRequest(sender, receiver);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Friend request rejected',
        data: result,
    });
});
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
    const result = yield network_service_1.networkService.sendMessage(sender, receiver, message);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Message sent',
        data: result,
    });
});
const getSentRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield network_service_1.networkService.getSentRequests(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Sent requests fetched',
        data: result,
    });
});
const getPendingRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield network_service_1.networkService.getPendingRequests(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Pending requests fetched',
        data: result,
    });
});
const getFriendsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield network_service_1.networkService.getFriendsList(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Friends list fetched',
        data: result,
    });
});
exports.networkController = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    sendMessage,
    getSentRequests,
    getPendingRequests,
    getFriendsList,
};
