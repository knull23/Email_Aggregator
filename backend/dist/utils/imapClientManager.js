"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImapClientManager = void 0;
const imapflow_1 = require("imapflow");
const mailparser_1 = require("mailparser");
const searchService_1 = require("../services/searchService");
const aiService_1 = require("../services/aiService");
const notificationService_1 = require("../services/notificationService");
const Email_1 = require("../models/Email");
const logger_1 = require("./logger");
class ImapClientManager {
    constructor(accountConfigs) {
        this.accountConfigs = accountConfigs;
        this.clients = [];
    }
    async start() {
        for (const cfg of this.accountConfigs) {
            const client = new imapflow_1.ImapFlow({
                host: cfg.host,
                port: cfg.port || 993,
                secure: cfg.secure !== false, // default true
                auth: {
                    user: cfg.user,
                    pass: cfg.pass,
                },
            });
            client.on('error', (err) => {
                logger_1.logger.error(`IMAP error for ${cfg.user}: ${err}`);
            });
            await client.connect();
            await client.mailboxOpen('INBOX');
            const sinceDate = new Date();
            sinceDate.setDate(sinceDate.getDate() - 30);
            try {
                for await (const msg of client.fetch({ since: sinceDate.toISOString() }, { envelope: true, source: true })) {
                    if (msg.source) {
                        await this.processRawMessage(msg.source, cfg.user);
                    }
                }
            }
            catch (err) {
                logger_1.logger.error(`Initial fetch failed for ${cfg.user}: ${err}`);
            }
            client.on('new', async () => {
                try {
                    for await (const msg of client.fetch('1:*', {
                        envelope: true,
                        source: true,
                    })) {
                        if (msg.source) {
                            await this.processRawMessage(msg.source, cfg.user);
                        }
                    }
                }
                catch (err) {
                    logger_1.logger.error(`Live fetch error for ${cfg.user}: ${err}`);
                }
            });
            this.clients.push(client);
            logger_1.logger.info(`IMAP connected & listening: ${cfg.user}`);
        }
    }
    async processRawMessage(raw, accountUser) {
        try {
            const parsed = await (0, mailparser_1.simpleParser)(raw);
            // Safely extract .text from AddressObject or AddressObject[]
            const getTextAddress = (addr) => {
                if (!addr)
                    return '';
                if (Array.isArray(addr)) {
                    return addr.map((a) => a.text).join(', ');
                }
                else if ('text' in addr) {
                    return addr.text;
                }
                return '';
            };
            const fromText = getTextAddress(parsed.from);
            const toText = getTextAddress(parsed.to);
            const textContent = parsed.text || '';
            const subjectContent = parsed.subject || '';
            const emailText = textContent || subjectContent || '';
            const emailDoc = new Email_1.EmailModel({
                account: accountUser,
                folder: 'INBOX',
                from: fromText,
                to: toText,
                subject: subjectContent,
                date: parsed.date || new Date(),
                body: textContent,
                html: parsed.html || '',
                category: 'Uncategorized',
            });
            await emailDoc.save();
            // Index email to Elasticsearch
            await (0, searchService_1.indexEmail)({
                id: emailDoc._id.toString(),
                account: emailDoc.account,
                folder: emailDoc.folder,
                from: emailDoc.from,
                to: emailDoc.to,
                subject: emailDoc.subject,
                date: emailDoc.date,
                body: emailDoc.body,
            });
            // AI categorization
            const category = await (0, aiService_1.categorizeEmail)(emailText);
            emailDoc.category = category;
            await emailDoc.save();
            // Notify if "Interested"
            if (category === 'Interested') {
                await (0, notificationService_1.notifyInterestedEmail)({
                    id: emailDoc._id.toString(),
                    from: emailDoc.from,
                    subject: emailDoc.subject,
                    body: emailDoc.body,
                });
            }
            logger_1.logger.info(`Processed email "${subjectContent}" → category: ${category}`);
        }
        catch (err) {
            logger_1.logger.error(`Error processing email: ${err}`);
        }
    }
    async stop() {
        for (const client of this.clients) {
            try {
                await client.logout();
            }
            catch (err) {
                logger_1.logger.warn(`Error disconnecting IMAP client: ${err}`);
            }
        }
    }
}
exports.ImapClientManager = ImapClientManager;
