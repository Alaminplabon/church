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
exports.activityService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const s3_1 = require("../../utils/s3");
const activity_models_1 = __importDefault(require("./activity.models"));
const createActivity = (payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    if (files) {
        const { images } = FileSystem;
        if (images === null || images === void 0 ? void 0 : images.length) {
            const imgsArray = [];
            images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imgsArray.push({
                    file: image,
                    path: `images/activity/images/${Math.floor(100000 + Math.random() * 900000)}`,
                });
            }));
            payload.images = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
    }
    const result = yield activity_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create activity');
    }
    return result;
});
const getAllActivities = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const activityModel = new QueryBuilder_1.default(activity_models_1.default.find({ isDeleted: false }), query)
        .search(['title', 'description'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield activityModel.modelQuery;
    const meta = yield activityModel.countTotal();
    return {
        data,
        meta,
    };
});
const getActivityById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield activity_models_1.default.findById(id);
    if (!result || result.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Activity not found!');
    }
    return result;
});
const updateActivity = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield activity_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to update activity');
    }
    return result;
});
const deleteActivity = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield activity_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete activity');
    }
    return result;
});
exports.activityService = {
    createActivity,
    getAllActivities,
    getActivityById,
    updateActivity,
    deleteActivity,
};
