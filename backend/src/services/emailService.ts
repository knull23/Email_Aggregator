import { EmailModel, IEmail } from '../models/Email';

export const getAllEmails = async (): Promise<IEmail[]> => {
  return EmailModel.find().sort({ date: -1 }).limit(100).lean();
};

export const getEmailById = async (id: string): Promise<IEmail | null> => {
  return EmailModel.findById(id).lean();
};
