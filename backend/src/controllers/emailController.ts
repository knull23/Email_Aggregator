import { Request, Response } from 'express';
import { getAllEmails, getEmailById } from '../services/emailService';

export const fetchEmails = async (req: Request, res: Response) => {
  try {
    const emails = await getAllEmails();
    res.json(emails);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};

export const fetchEmailDetail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const email = await getEmailById(id);
    if (!email) return res.status(404).json({ error: 'Email not found' });
    res.json(email);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch email detail' });
  }
};
