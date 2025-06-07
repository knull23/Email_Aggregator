"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailById = exports.getAllEmails = void 0;
const Email_1 = require("../models/Email");
const getAllEmails = async () => {
    return Email_1.EmailModel.find().sort({ date: -1 }).limit(100).lean();
};
exports.getAllEmails = getAllEmails;
const getEmailById = async (id) => {
    return Email_1.EmailModel.findById(id).lean();
};
exports.getEmailById = getEmailById;
