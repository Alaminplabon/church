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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const locationSchema = new mongoose_1.Schema({
    country: { type: String },
    state: { type: String },
    city: { type: String },
    streetAddress: { type: String },
    zipCode: { type: Number },
});
const userSchema = new mongoose_1.Schema({
    status: { type: String },
    username: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    registrationCode: { type: String },
    servicesType: {
        type: [String], // Change to an array of strings
        enum: [
            'Travel & Hospitality',
            'Teaching & Education',
            'Digital Services',
            'Health & Wellness',
            'Art & Music',
            'Technology Assistance',
            'Hobbies & Passions',
            'Consulting Services',
        ],
    },
    servicesTags: { type: [String] },
    hobbies: { type: [String] },
    title: { type: String },
    phoneNumber: { type: String },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Others'] },
    dateOfBirth: { type: String },
    image: { type: String },
    role: {
        type: String,
        enum: ['administrator', 'member', 'admin'],
        required: true,
    },
    isGoogleLogin: { type: Boolean },
    address: locationSchema,
    needsPasswordChange: { type: Boolean, required: true, default: false },
    passwordChangedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    verification: {
        otp: { type: mongoose_1.Schema.Types.Mixed },
        expiresAt: { type: Date },
        status: { type: Boolean },
    },
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const user = this;
        if (!(user === null || user === void 0 ? void 0 : user.isGoogleLogin)) {
            user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        }
        next();
    });
});
// set '' after saving password
userSchema.post('save', 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function (error, doc, next) {
    doc.password = '';
    next();
});
userSchema.pre('find', function (next) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.find({ isDeleted: { $ne: true } });
    next();
});
userSchema.pre('findOne', function (next) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.find({ isDeleted: { $ne: true } });
    next();
});
userSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
userSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email: email }).select('+password');
    });
};
userSchema.statics.IsUserExistId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findById(id).select('+password');
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
exports.User = (0, mongoose_1.model)('User', userSchema);
