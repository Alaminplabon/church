"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRoutes = void 0;
const express_1 = require("express");
const subscription_controller_1 = require("./subscription.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constants_1 = require("../user/user.constants");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constants_1.USER_ROLE.administrator), subscription_controller_1.subscriptionController.createSubscription);
router.patch('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.administrator), subscription_controller_1.subscriptionController.updateSubscription);
router.delete('/:id', (0, auth_1.default)(user_constants_1.USER_ROLE.administrator), subscription_controller_1.subscriptionController.deleteSubscription);
router.get('/user/:userId', (0, auth_1.default)(user_constants_1.USER_ROLE.administrator, user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.user, user_constants_1.USER_ROLE.admin), subscription_controller_1.subscriptionController.getSubscriptionByUserId);
router.get('/my-subscriptions', (0, auth_1.default)(user_constants_1.USER_ROLE === null || user_constants_1.USER_ROLE === void 0 ? void 0 : user_constants_1.USER_ROLE.user), subscription_controller_1.subscriptionController.getMySubscription);
router.get('/:id', subscription_controller_1.subscriptionController.getSubscriptionById);
router.get('/', subscription_controller_1.subscriptionController.getAllSubscription);
exports.subscriptionRoutes = router;
