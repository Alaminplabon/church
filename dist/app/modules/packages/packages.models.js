"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const packages_constants_1 = require("./packages.constants");
const PackageSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    shortTitle: { type: String, required: true },
    shortDescription: { type: String, required: true },
    monthlyPrice: { type: Number, required: true, min: 0 },
    yearlyPrice: { type: Number, required: true, min: 0 },
    popularity: { type: Number, default: 0 },
    durationType: {
        type: String,
        enum: Object.values(packages_constants_1.durationType), // Restrict to "monthly" or "yearly"
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Middleware to exclude deleted packages
PackageSchema.pre('find', function (next) {
    //@ts-ignore
    this.find({ isDeleted: { $ne: true } });
    next();
});
PackageSchema.pre('findOne', function (next) {
    //@ts-ignore
    this.find({ isDeleted: { $ne: true } });
    next();
});
PackageSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const Package = (0, mongoose_1.model)('Package', PackageSchema);
exports.default = Package;
