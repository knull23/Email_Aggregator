import { ImapFlow } from 'imapflow';
import { simpleParser, AddressObject } from 'mailparser';
import { indexEmail } from '../services/searchService';
import { categorizeEmail } from '../services/aiService';
import { notifyInterestedEmail } from '../services/notificationService';
import { EmailModel } from '../models/Email';
import { logger } from './logger';

interface ImapAccountConfig {
  user: string;
  pass: string;
  host: string;
  port?: number;
  secure?: boolean;
}

export class ImapClientManager {
  private clients: ImapFlow[] = [];

  constructor(private accountConfigs: ImapAccountConfig[]) {}

  public async start() {
    for (const cfg of this.accountConfigs) {
      const client = new ImapFlow({
        host: cfg.host,
        port: cfg.port || 993,
        secure: cfg.secure !== false, // default true
        auth: {
          user: cfg.user,
          pass: cfg.pass,
        },
      });

      client.on('error', (err) => {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(`IMAP error for ${cfg.user}: ${msg}`);
      });

      try {
        await client.connect();
        await client.mailboxOpen('INBOX');

        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - 30);

        // Initial fetch for emails since last 30 days
        for await (const msg of client.fetch(
          { since: sinceDate.toISOString() },
          { envelope: true, source: true }
        )) {
          if (msg.source) {
            await this.processRawMessage(msg.source, cfg.user);
          }
        }

        // Listen for new emails arriving after connection
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
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            logger.error(`Live fetch error for ${cfg.user}: ${msg}`);
          }
        });

        this.clients.push(client);
        logger.info(`IMAP connected & listening: ${cfg.user}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(`Failed to start IMAP client for ${cfg.user}: ${msg}`);
      }
    }
  }

  private async processRawMessage(raw: Buffer, accountUser: string) {
    try {
      const parsed = await simpleParser(raw);

      const getTextAddress = (addr?: AddressObject | AddressObject[] | null): string => {
        if (!addr) return '';
        if (Array.isArray(addr)) {
          return addr.map((a) => a.text).join(', ');
        } else if ('text' in addr) {
          return addr.text;
        }
        return '';
      };

      const fromText = getTextAddress(parsed.from);
      const toText = getTextAddress(parsed.to);
      const textContent = parsed.text || '';
      const subjectContent = parsed.subject || '';
      const emailText = textContent || subjectContent || '';

      const emailDoc = new EmailModel({
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
      await indexEmail({
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
      const category = await categorizeEmail(emailText);
      emailDoc.category = category;
      await emailDoc.save();

      // Notify if "Interested"
      if (category === 'Interested') {
        await notifyInterestedEmail({
          id: emailDoc._id.toString(),
          from: emailDoc.from,
          subject: emailDoc.subject,
          body: emailDoc.body,
        });
      }

      logger.info(`Processed email "${subjectContent}" → category: ${category}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`Error processing email: ${msg}`);
    }
  }

  public async stop() {
    for (const client of this.clients) {
      try {
        await client.logout();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.warn(`Error disconnecting IMAP client: ${msg}`);
      }
    }
  }
}
