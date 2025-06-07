import { Request, Response } from 'express';
import { searchEmails } from '../services/searchService';

export const searchEmailsController = async (req: Request, res: Response) => {
  try {
    const { q, folder, account } = req.query as {
      q: string;
      folder?: string;
      account?: string;
    };
    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });
    const results = await searchEmails(q, folder, account);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};
