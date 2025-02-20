"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otp_routes_1 = require("../modules/otp/otp.routes");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const notificaiton_route_1 = require("../modules/notification/notificaiton.route");
const church_route_1 = require("../modules/church/church.route");
const codeGenerator_route_1 = require("../modules/codeGenerator/codeGenerator.route");
const event_route_1 = require("../modules/event/event.route");
const packages_route_1 = require("../modules/packages/packages.route");
const subscription_route_1 = require("../modules/subscription/subscription.route");
const payments_route_1 = require("../modules/payments/payments.route");
const work_route_1 = require("../modules/work/work.route");
const activity_route_1 = require("../modules/activity/activity.route");
const sponsor_route_1 = require("../modules/sponsor/sponsor.route");
const network_route_1 = require("../modules/network/network.route");
const messages_route_1 = require("../modules/messages/messages.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.userRoutes,
    },
    {
        path: '/auth',
        route: auth_route_1.authRoutes,
    },
    {
        path: '/otp',
        route: otp_routes_1.otpRoutes,
    },
    {
        path: '/notifications',
        route: notificaiton_route_1.notificationRoutes,
    },
    {
        path: '/churches',
        route: church_route_1.churchRoutes,
    },
    {
        path: '/codeGenerator',
        route: codeGenerator_route_1.codeGeneratorRoutes,
    },
    {
        path: '/events',
        route: event_route_1.eventRoutes,
    },
    {
        path: '/package',
        route: packages_route_1.packagesRoutes,
    },
    {
        path: '/subscriptions',
        route: subscription_route_1.subscriptionRoutes,
    },
    {
        path: '/payments',
        route: payments_route_1.paymentsRoutes,
    },
    {
        path: '/work',
        route: work_route_1.workRoutes,
    },
    {
        path: '/activities',
        route: activity_route_1.activityRoutes,
    },
    {
        path: '/sponsor',
        route: sponsor_route_1.sponsorRoutes,
    },
    {
        path: '/network',
        route: network_route_1.networkRoutes,
    },
    {
        path: '/messages',
        route: messages_route_1.messagesRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
