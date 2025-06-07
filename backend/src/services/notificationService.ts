import { IncomingWebhook } from '@slack/webhook';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || '';
const externalWebhookUrl = process.env.WEBHOOK_SITE_URL || '';

const slackWebhook = new IncomingWebhook(slackWebhookUrl);

export const notifyInterestedEmail = async (email: {
  id: string;
  from: string;
  subject: string;
  body: string;
}) => {
  // Slack notification
  await slackWebhook.send({
    text: `*New Interested Email*\n• From: ${email.from}\n• Subject: ${email.subject}`
  });

  // External webhook
  await axios.post(externalWebhookUrl, {
    id: email.id,
    from: email.from,
    subject: email.subject,
    body: email.body
  });
};
