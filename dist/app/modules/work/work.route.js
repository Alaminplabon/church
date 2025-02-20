"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workRoutes = void 0;
const express_1 = require("express");
const work_controller_1 = require("./work.controller");
const router = (0, express_1.Router)();
router.post('/create-work', work_controller_1.workController.createWork);
router.patch('/update/:id', work_controller_1.workController.updateWork);
router.delete('/:id', work_controller_1.workController.deleteWork);
router.get('/:id', work_controller_1.workController.getWorkById);
router.get('/', work_controller_1.workController.getAllWork);
exports.workRoutes = router;
