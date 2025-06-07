import apiClient from './apiClient';

export interface EmailSummary {
  id: string;
  account: string;
  folder: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  category: string;
}

export interface EmailDetail extends EmailSummary {
  body: string;
  html: string;
}

export const fetchEmails = async (): Promise<EmailSummary[]> => {
  const resp = await apiClient.get<EmailSummary[]>('/emails');
  return resp.data;
};

export const fetchEmailDetail = async (id: string): Promise<EmailDetail> => {
  const resp = await apiClient.get<EmailDetail>(`/emails/${id}`);
  return resp.data;
};
