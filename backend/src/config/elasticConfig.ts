import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();

const node = process.env.ELASTIC_NODE || 'http://localhost:9200';
export const elasticClient = new Client({ node });
