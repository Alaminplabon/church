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
exports.eventService = void 0;
// Event Service
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const event_models_1 = __importDefault(require("./event.models"));
const s3_1 = require("../../utils/s3");
const createEvent = (payload, userId, files) => __awaiter(void 0, void 0, void 0, function* () {
    if (files) {
        const { images } = FileSystem;
        if (images === null || images === void 0 ? void 0 : images.length) {
            const imgsArray = [];
            images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imgsArray.push({
                    file: image,
                    path: `images/event/images/${Math.floor(100000 + Math.random() * 900000)}`,
                });
            }));
            payload.bannerImage = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
    }
    const result = yield event_models_1.default.create(Object.assign(Object.assign({}, payload), { userId }));
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create event');
    }
    return result;
});
const getAllEvents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const eventModel = new QueryBuilder_1.default(event_models_1.default.find({ isDeleted: false }), query)
        .search([])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield eventModel.modelQuery;
    const meta = yield eventModel.countTotal();
    return {
        data,
        meta,
    };
});
const getEventById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_models_1.default.findById(id);
    if (!result || result.isDeleted) {
        throw new Error('Event not found!');
    }
    return result;
});
const updateEvent = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new Error('Failed to update event');
    }
    return result;
});
const deleteEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete event');
    }
    return result;
});
exports.eventService = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};
