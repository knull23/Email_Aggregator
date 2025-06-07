import apiClient from './apiClient';

export interface SearchResult {
  id: string;
  account: string;
  folder: string;
  from: string;
  to: string;
  subject: string;
  date: string;
}

export const searchEmails = async (
  q: string,
  folder?: string,
  account?: string
): Promise<SearchResult[]> => {
  const params: any = { q };
  if (folder) params.folder = folder;
  if (account) params.account = account;
  const resp = await apiClient.get<SearchResult[]>('/search', { params });
  return resp.data;
};
