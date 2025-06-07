"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEmails = exports.indexEmail = void 0;
const elasticConfig_1 = require("../config/elasticConfig");
const indexEmail = async (email) => {
    await elasticConfig_1.elasticClient.index({
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
exports.indexEmail = indexEmail;
const searchEmails = async (query, folder, account) => {
    const must = [{ match: { body: query } }];
    if (folder)
        must.push({ term: { folder } });
    if (account)
        must.push({ term: { account } });
    const resp = await elasticConfig_1.elasticClient.search({
        index: 'emails',
        size: 50,
        query: { bool: { must } }
    });
    return resp.hits.hits.map((hit) => ({
        id: hit._id,
        ...hit._source
    }));
};
exports.searchEmails = searchEmails;
