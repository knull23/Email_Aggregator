"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const dbConfig_1 = require("./config/dbConfig");
const imapClientManager_1 = require("./utils/imapClientManager");
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const replyRoutes_1 = __importDefault(require("./routes/replyRoutes"));
const logger_1 = require("./utils/logger");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
(0, dbConfig_1.connectDB)();
// Parse IMAP_ACCOUNTS from env
const rawAccounts = process.env.IMAP_ACCOUNTS || '';
const accountConfigs = rawAccounts.split(',').map((entry) => {
    // Format: user:pass@host[:port]
    const [creds, hostPart] = entry.split('@');
    const [user, pass] = creds.split(':');
    const [host, portStr] = hostPart.split(':');
    return {
        user,
        pass,
        host,
        port: portStr ? parseInt(portStr, 10) : 993,
        secure: true
    };
});
// Start IMAP listeners
const imapManager = new imapClientManager_1.ImapClientManager(accountConfigs);
imapManager
    .start()
    .then(() => logger_1.logger.info('IMAP Manager started'))
    .catch((err) => logger_1.logger.error('IMAP Manager failed to start:', err));
// Routes
app.use('/api/emails', emailRoutes_1.default);
app.use('/api/search', searchRoutes_1.default);
app.use('/api/reply', replyRoutes_1.default);
// Health check
app.get('/', (_req, res) => res.send('Onebox Email Aggregator API'));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger_1.logger.info(`Backend running on http://localhost:${PORT}`);
});
