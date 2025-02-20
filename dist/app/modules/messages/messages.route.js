"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesRoutes = void 0;
const express_1 = require("express");
const messages_controller_1 = require("./messages.controller");
const router = (0, express_1.Router)();
// Send a message to a user
router.post('/send-message', messages_controller_1.messageController.sendMessage);
// Get all messages between the authenticated user and another user
router.get('/messages/:receiver', messages_controller_1.messageController.getMessages);
exports.messagesRoutes = router;
