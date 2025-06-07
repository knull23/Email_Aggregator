import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/dbConfig';
import { ImapClientManager } from './utils/imapClientManager';
import emailRoutes from './routes/emailRoutes';
import searchRoutes from './routes/searchRoutes';
import replyRoutes from './routes/replyRoutes';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Parse IMAP_ACCOUNTS from env
const rawAccounts = process.env.IMAP_ACCOUNTS || '';
const accountConfigs = rawAccounts.split(',').map((entry) => {
  // Format: user:pass@host:port
  const [creds, hostPart] = entry.split('@');
  if (!creds || !hostPart) {
    logger.error(`Invalid IMAP_ACCOUNTS entry: ${entry}`);
    throw new Error(`Invalid IMAP_ACCOUNTS entry: ${entry}`);
  }
  const [user, pass] = creds.split(':');
  if (!user || !pass) {
    logger.error(`Invalid user/pass in IMAP_ACCOUNTS entry: ${entry}`);
    throw new Error(`Invalid user/pass in IMAP_ACCOUNTS entry: ${entry}`);
  }
  const [host, portStr] = hostPart.split(':');
  return {
    user,
    pass,
    host,
    port: portStr ? parseInt(portStr, 10) : 993,
    secure: true,
  };
});

// Start IMAP listeners
const imapManager = new ImapClientManager(accountConfigs);
imapManager
  .start()
  .then(() => logger.info('IMAP Manager started'))
  .catch((err) => logger.error('IMAP Manager failed to start:', err));

// Routes
app.use('/api/emails', emailRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/reply', replyRoutes);

// Health check
app.get('/', (_req, res) => res.send('Onebox Email Aggregator API'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Backend running on http://localhost:${PORT}`);
});
