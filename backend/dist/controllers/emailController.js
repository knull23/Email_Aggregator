"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchEmailDetail = exports.fetchEmails = void 0;
const emailService_1 = require("../services/emailService");
const fetchEmails = async (req, res) => {
    try {
        const emails = await (0, emailService_1.getAllEmails)();
        res.json(emails);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch emails' });
    }
};
exports.fetchEmails = fetchEmails;
const fetchEmailDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const email = await (0, emailService_1.getEmailById)(id);
        if (!email)
            return res.status(404).json({ error: 'Email not found' });
        res.json(email);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch email detail' });
    }
};
exports.fetchEmailDetail = fetchEmailDetail;
