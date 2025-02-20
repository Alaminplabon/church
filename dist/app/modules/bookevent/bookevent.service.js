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
exports.bookEventService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const bookevent_models_1 = __importDefault(require("./bookevent.models"));
const createBookEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate if the user has already booked the event
    const existingBooking = yield bookevent_models_1.default.findOne({
        userId: payload.userId,
        eventId: payload.eventId,
        isDeleted: false,
    });
    if (existingBooking) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, 'Event is already booked by this user');
    }
    const result = yield bookevent_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to book event');
    }
    return result;
});
const getAllBookedEvents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const bookEventModel = new QueryBuilder_1.default(bookevent_models_1.default.find({ isDeleted: false }), query)
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield bookEventModel.modelQuery;
    const meta = yield bookEventModel.countTotal();
    return {
        data,
        meta,
    };
});
const getBookedEventById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookevent_models_1.default.findById(id).populate('userId eventId');
    if (!result || result.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Booked event not found');
    }
    return result;
});
const deleteBookedEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookevent_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete booked event');
    }
    return result;
});
exports.bookEventService = {
    createBookEvent,
    getAllBookedEvents,
    getBookedEventById,
    deleteBookedEvent,
};
