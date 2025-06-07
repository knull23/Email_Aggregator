"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestedReply = void 0;
const aiService_1 = require("../services/aiService");
const vectorService_1 = require("../services/vectorService");
const getSuggestedReply = async (req, res) => {
    try {
        const { emailId } = req.params;
        const { emailContent } = req.body;
        if (!emailContent)
            return res.status(400).json({ error: 'emailContent is required' });
        const contextDocs = await (0, vectorService_1.getRelevantDocuments)(emailContent);
        const reply = await (0, aiService_1.generateReply)(emailContent, contextDocs);
        res.json({ reply });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to generate reply' });
    }
};
exports.getSuggestedReply = getSuggestedReply;
