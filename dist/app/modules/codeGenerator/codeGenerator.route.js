"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeGeneratorRoutes = void 0;
const express_1 = require("express");
const codeGenerator_controller_1 = require("./codeGenerator.controller");
const router = (0, express_1.Router)();
router.post('/generate', codeGenerator_controller_1.codeController.createCodes); // Route for generating codes
router.post('/validate', codeGenerator_controller_1.codeController.validateCode); // Route for validating codes
exports.codeGeneratorRoutes = router;
