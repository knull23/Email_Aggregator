import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export const categorizeEmail = async (emailContent: string): Promise<string> => {
  const prompt = `Categorize the following email into one of these labels: Interested, Meeting Booked, Not Interested, Spam, Out of Office.\n\nEmail:\n"""${emailContent}"""\n\nCategory:`;

  const completion = await openai.completions.create({
    model: 'text-davinci-003',
    prompt,
    max_tokens: 10,
    temperature: 0,
  });

  return completion.choices[0].text.trim();
};

export const generateReply = async (
  emailContent: string,
  contextDocs: string[]
): Promise<string> => {
  const prompt = `You have these context documents:\n${contextDocs.join(
    '\n\n'
  )}\n\nBased on them, generate a polite reply to this email:\n"""${emailContent}"""`;

  const completion = await openai.completions.create({
    model: 'text-davinci-003',
    prompt,
    max_tokens: 150,
    temperature: 0.7,
  });

  return completion.choices[0].text.trim();
};
