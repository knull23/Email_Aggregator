import apiClient from './apiClient';

export const getSuggestedReply = async (
  emailId: string,
  emailContent: string
): Promise<string> => {
  const resp = await apiClient.post<{ reply: string }>(`/reply/${emailId}`, {
    emailContent
  });
  return resp.data.reply;
};
