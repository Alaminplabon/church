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
exports.prayerRequestController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const prayerrequest_service_1 = require("./prayerrequest.service");
const createPrayerRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prayerrequest_service_1.prayerRequestService.createPrayerRequest(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Prayer request created successfully',
        data: result,
    });
}));
const getAllPrayerRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prayerrequest_service_1.prayerRequestService.getAllPrayerRequests(req.query);
        return res.status(200).json({
            success: true,
            data: result.data,
            noChurchRequests: result.noChurchRequests,
            meta: result.meta,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An error occurred while fetching prayer requests.',
        });
    }
}));
const getPrayerRequestById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prayerrequest_service_1.prayerRequestService.getPrayerRequestById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Prayer request fetched successfully',
        data: result,
    });
}));
const deletePrayerRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prayerrequest_service_1.prayerRequestService.deletePrayerRequest(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Prayer request deleted successfully',
        data: result,
    });
}));
exports.prayerRequestController = {
    createPrayerRequest,
    getAllPrayerRequests,
    getPrayerRequestById,
    deletePrayerRequest,
};
