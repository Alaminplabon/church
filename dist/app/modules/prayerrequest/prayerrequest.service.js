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
exports.prayerRequestService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const prayerrequest_models_1 = __importDefault(require("./prayerrequest.models"));
const createPrayerRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prayerrequest_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create prayer request');
    }
    return result;
});
const getAllPrayerRequests = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const prayerRequestModel = new QueryBuilder_1.default(prayerrequest_models_1.default.find({ isDeleted: false }), query)
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield prayerRequestModel.modelQuery;
    const noChurchRequests = data.filter((prayerRequest) => !prayerRequest.churchId);
    const meta = yield prayerRequestModel.countTotal();
    return {
        data,
        noChurchRequests,
        meta,
    };
});
const getPrayerRequestById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prayerrequest_models_1.default.findById(id).populate('churchId');
    if (!result || result.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Prayer request not found');
    }
    return result;
});
const deletePrayerRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prayerrequest_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete prayer request');
    }
    return result;
});
exports.prayerRequestService = {
    createPrayerRequest,
    getAllPrayerRequests,
    getPrayerRequestById,
    deletePrayerRequest,
};
