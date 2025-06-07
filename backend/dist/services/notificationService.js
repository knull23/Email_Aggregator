"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyInterestedEmail = void 0;
const webhook_1 = require("@slack/webhook");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || '';
const externalWebhookUrl = process.env.WEBHOOK_SITE_URL || '';
const slackWebhook = new webhook_1.IncomingWebhook(slackWebhookUrl);
const notifyInterestedEmail = async (email) => {
    // Slack notification
    await slackWebhook.send({
        text: `*New Interested Email*\n• From: ${email.from}\n• Subject: ${email.subject}`
    });
    // External webhook
    await axios_1.default.post(externalWebhookUrl, {
        id: email.id,
        from: email.from,
        subject: email.subject,
        body: email.body
    });
};
exports.notifyInterestedEmail = notifyInterestedEmail;
