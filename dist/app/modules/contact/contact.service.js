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
exports.contactService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const contact_models_1 = __importDefault(require("./contact.models"));
const path_1 = __importDefault(require("path"));
const mailSender_1 = require("../../utils/mailSender");
const user_models_1 = require("../user/user.models");
const fs_1 = __importDefault(require("fs"));
const createContact = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const contacts = yield contact_models_1.default.create(payload);
    if (!contacts) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create contact');
    }
    const admin = yield user_models_1.User.findOne({ role: 'admin' });
    if (!admin || !admin.email) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Admin email not found');
    }
    const emailTemplatePath = path_1.default.join(__dirname, '../../../../public/view/contact_mail.html');
    if (!fs_1.default.existsSync(emailTemplatePath)) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Email template not found');
    }
    const emailTemplate = fs_1.default.readFileSync(emailTemplatePath, 'utf8');
    const emailContent = emailTemplate
        .replace('{{firstName}}', payload.firstName)
        .replace('{{lastName}}', payload.lastName)
        .replace('{{email}}', payload.email)
        .replace('{{description}}', payload.description);
    yield (0, mailSender_1.sendEmail)(admin.email, 'A new contact has been added', emailContent);
    return contacts;
});
const getAllcontact = () => __awaiter(void 0, void 0, void 0, function* () {
    const contacts = yield contact_models_1.default.find();
    if (!contacts) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No contacts found');
    }
    return contacts;
});
const getcontactById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const contactById = yield contact_models_1.default.findById(id);
    if (!contactById) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Contact not found');
    }
    return contactById;
});
const updatecontact = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedContact = yield contact_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedContact) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Contact not found to update');
    }
    return updatedContact;
});
const deletecontact = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedContact = yield contact_models_1.default.findByIdAndDelete(id);
    if (!deletedContact) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Contact not found to delete');
    }
    return deletedContact;
});
exports.contactService = {
    createContact,
    getAllcontact,
    getcontactById,
    updatecontact,
    deletecontact,
};
