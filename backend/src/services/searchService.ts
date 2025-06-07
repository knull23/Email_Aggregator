import { elasticClient } from '../config/elasticConfig';

export const indexEmail = async (email: any) => {
  await elasticClient.index({
    index: 'emails',
    id: email.id,
    document: {
      account: email.account,
      folder: email.folder,
      from: email.from,
      to: email.to,
      subject: email.subject,
      date: email.date,
      body: email.body
    }
  });
};

export const searchEmails = async (
  query: string,
  folder?: string,
  account?: string
) => {
  const must: any[] = [{ match: { body: query } }];
  if (folder) must.push({ term: { folder } });
  if (account) must.push({ term: { account } });

  const resp = await elasticClient.search({
    index: 'emails',
    size: 50,
    query: { bool: { must } }
  });
  return resp.hits.hits.map((hit: any) => ({
    id: hit._id,
    ...hit._source
  }));
};
