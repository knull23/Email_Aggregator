"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReply = exports.categorizeEmail = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const categorizeEmail = async (emailContent) => {
    const prompt = `Categorize the following email into one of these labels: Interested, Meeting Booked, Not Interested, Spam, Out of Office.\n\nEmail:\n"""${emailContent}"""\n\nCategory:`;
    const completion = await openai.completions.create({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 10,
        temperature: 0,
    });
    return completion.choices[0].text.trim();
};
exports.categorizeEmail = categorizeEmail;
const generateReply = async (emailContent, contextDocs) => {
    const prompt = `You have these context documents:\n${contextDocs.join('\n\n')}\n\nBased on them, generate a polite reply to this email:\n"""${emailContent}"""`;
    const completion = await openai.completions.create({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 150,
        temperature: 0.7,
    });
    return completion.choices[0].text.trim();
};
exports.generateReply = generateReply;
