"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookeventRoutes = void 0;
const express_1 = require("express");
const bookevent_controller_1 = require("./bookevent.controller");
const router = (0, express_1.Router)();
router.post('/create-bookevent', bookevent_controller_1.bookeventController.createbookevent);
router.patch('/update/:id', bookevent_controller_1.bookeventController.updatebookevent);
router.delete('/:id', bookevent_controller_1.bookeventController.deletebookevent);
router.get('/:id', bookevent_controller_1.bookeventController.getbookevent);
router.get('/', bookevent_controller_1.bookeventController.getbookevent);
exports.bookeventRoutes = router;
