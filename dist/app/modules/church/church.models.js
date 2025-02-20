"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const churchSchema = new mongoose_1.Schema({
    churchName: {
        type: String,
        required: [true, 'Church name is required'],
        unique: true,
    },
    description: {
        type: String,
        default: null,
    },
    images: [String],
    administrator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    regCode: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ChurchRegistration',
        required: true,
    },
    location: {
        coordinates: [Number],
        type: { type: String, default: 'Point' },
    },
    members: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    isDeleted: { type: 'boolean', default: false },
}, {
    timestamps: true,
});
//churchSchema.pre('find', function (next) {
//  //@ts-ignore
//  this.find({ isDeleted: { $ne: true } });
//  next();
//});
//churchSchema.pre('findOne', function (next) {
//@ts-ignore
//this.find({ isDeleted: { $ne: true } });
// next();
//});
churchSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const Church = (0, mongoose_1.model)('Church', churchSchema);
exports.default = Church;
