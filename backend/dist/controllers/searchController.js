"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEmailsController = void 0;
const searchService_1 = require("../services/searchService");
const searchEmailsController = async (req, res) => {
    try {
        const { q, folder, account } = req.query;
        if (!q)
            return res.status(400).json({ error: 'Query parameter q is required' });
        const results = await (0, searchService_1.searchEmails)(q, folder, account);
        res.json(results);
    }
    catch (err) {
        res.status(500).json({ error: 'Search failed' });
    }
};
exports.searchEmailsController = searchEmailsController;
