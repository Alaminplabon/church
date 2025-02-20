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
exports.churchService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const church_models_1 = __importDefault(require("./church.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const s3_1 = require("../../utils/s3");
const createChurch = (payload, files) => __awaiter(void 0, void 0, void 0, function* () {
    if (files) {
        const { images } = FileSystem;
        if (images === null || images === void 0 ? void 0 : images.length) {
            const imgsArray = [];
            images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imgsArray.push({
                    file: image,
                    path: `images/church/images/${Math.floor(100000 + Math.random() * 900000)}`,
                });
            }));
            payload.images = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
    }
    const result = yield church_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create church');
    }
    return result;
});
const getAllChurch = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const churchModel = new QueryBuilder_1.default(church_models_1.default.find({ isDeleted: false }), query)
        .search([])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield churchModel.modelQuery;
    const meta = yield churchModel.countTotal();
    return {
        data,
        meta,
    };
});
const getChurchById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield church_models_1.default.findById(id);
    if (!result || result.isDeleted) {
        throw new Error('Church not found!');
    }
    return result;
});
const updateChurch = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield church_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new Error('Failed to update Church');
    }
    return result;
});
const deleteChurch = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield church_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete church');
    }
    return result;
});
exports.churchService = {
    createChurch,
    getAllChurch,
    getChurchById,
    updateChurch,
    deleteChurch,
};
