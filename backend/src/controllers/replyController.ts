import { Request, Response } from 'express';
import { generateReply } from '../services/aiService';
import { getRelevantDocuments } from '../services/vectorService';

export const getSuggestedReply = async (req: Request, res: Response) => {
  try {
    const { emailId } = req.params;
    const { emailContent } = req.body as { emailContent: string };
    if (!emailContent) return res.status(400).json({ error: 'emailContent is required' });

    const contextDocs = await getRelevantDocuments(emailContent);
    const reply = await generateReply(emailContent, contextDocs);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate reply' });
  }
};
