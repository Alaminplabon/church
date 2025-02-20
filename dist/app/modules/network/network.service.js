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
exports.networkService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const network_models_1 = __importDefault(require("./network.models"));
const messages_models_1 = __importDefault(require("../messages/messages.models"));
const sendFriendRequest = (sender, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRequest = yield network_models_1.default.findOne({
        $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
        ],
    });
    if (existingRequest) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Friend request already exists.');
    }
    const request = yield network_models_1.default.create({ sender, receiver, status: 'pending' });
    return request;
});
const acceptFriendRequest = (sender, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield network_models_1.default.findOneAndUpdate({ sender, receiver, status: 'pending' }, { status: 'accepted' }, { new: true });
    if (!request) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Friend request not found or already processed.');
    }
    return request;
});
const rejectFriendRequest = (sender, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield network_models_1.default.findOneAndUpdate({ sender, receiver, status: 'pending' }, { status: 'rejected' }, { new: true });
    if (!request) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Friend request not found.');
    }
    return request;
});
const sendMessage = (sender, receiver, message) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield network_models_1.default.findOne({
        $or: [
            { sender, receiver, status: 'accepted' },
            { sender: receiver, receiver: sender, status: 'accepted' },
        ],
    });
    if (!connection) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You must be friends to send a message.');
    }
    const msg = yield messages_models_1.default.create({ sender, receiver, message });
    connection.messages.push(msg._id);
    yield connection.save();
    return msg;
});
const getSentRequests = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const requests = yield network_models_1.default.find({ sender: userId });
    return requests;
});
const getPendingRequests = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const requests = yield network_models_1.default.find({ receiver: userId, status: 'pending' });
    return requests;
});
const getFriendsList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const friends = yield network_models_1.default.find({
        $or: [
            { sender: userId, status: 'accepted' },
            { receiver: userId, status: 'accepted' },
        ],
    });
    return friends;
});
exports.networkService = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    sendMessage,
    getSentRequests,
    getPendingRequests,
    getFriendsList,
};
