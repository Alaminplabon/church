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
exports.sponsorService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const sponsor_models_1 = __importDefault(require("./sponsor.models"));
const payments_models_1 = __importDefault(require("../payments/payments.models"));
const createSponsor = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate transaction ID
    const payment = yield payments_models_1.default.findOne({ tranId: payload.tranId });
    if (!payment || payment.isDeleted || !payment.isPaid) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid or unpaid transaction ID');
    }
    // Ensure the payment belongs to the user
    if (payment.user.toString() !== payload.userId) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Transaction does not belong to the user');
    }
    const sponsor = yield sponsor_models_1.default.create(payload);
    if (!sponsor) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create sponsorship');
    }
    return sponsor;
});
const getAllSponsors = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const sponsorModel = new QueryBuilder_1.default(sponsor_models_1.default.find({ isDeleted: false }), query)
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield sponsorModel.modelQuery;
    const meta = yield sponsorModel.countTotal();
    return {
        data,
        meta,
    };
});
const getSponsorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const sponsor = yield sponsor_models_1.default.findById(id).populate('tranId churchId userId');
    if (!sponsor || sponsor.isDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Sponsorship not found');
    }
    return sponsor;
});
const deleteSponsor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const sponsor = yield sponsor_models_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!sponsor) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete sponsorship');
    }
    return sponsor;
});
exports.sponsorService = {
    createSponsor,
    getAllSponsors,
    getSponsorById,
    deleteSponsor,
};
