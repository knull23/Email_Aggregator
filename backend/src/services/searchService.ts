import { elasticClient } from '../config/elasticConfig';
import { logger } from '../utils/logger';

export const indexEmail = async (email: any) => {
  try {
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
        body: email.body,
      },
    });
    logger.info(`Indexed email ID: ${email.id}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error(`Failed to index email ID ${email.id}: ${msg}`);
  }
};

export const searchEmails = async (
  query: string,
  folder?: string,
  account?: string
) => {
  try {
    const must: any[] = [{ match: { body: query } }];
    if (folder) must.push({ term: { folder } });
    if (account) must.push({ term: { account } });

    const resp = await elasticClient.search({
      index: 'emails',
      size: 50,
      query: { bool: { must } },
    });

    return resp.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source,
    }));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error(`Elastic search failed for query "${query}": ${msg}`);
    return [];
  }
};
