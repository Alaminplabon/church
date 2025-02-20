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
exports.messageService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const network_models_1 = __importDefault(require("../network/network.models"));
const messages_models_1 = __importDefault(require("./messages.models"));
const sendMessage = (sender, receiver, message) => __awaiter(void 0, void 0, void 0, function* () {
    const network = yield network_models_1.default.findOne({
        $or: [
            { sender, receiver, status: 'accepted' },
            { sender: receiver, receiver: sender, status: 'accepted' },
        ],
    });
    if (!network) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Connection not accepted. Cannot send message.');
    }
    const newMessage = yield messages_models_1.default.create({
        sender,
        receiver,
        message,
    });
    return newMessage;
});
const getMessages = (sender, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield messages_models_1.default.find({
        $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
        ],
    }).sort({ createdAt: 1 });
    return messages;
});
exports.messageService = {
    sendMessage,
    getMessages,
};
