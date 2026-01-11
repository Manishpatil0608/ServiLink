import knex from 'knex';
import knexConfig from '../../knexfile.js';
import { env } from './env.js';

const config = knexConfig[env.nodeEnv] || knexConfig.development;

export const db = knex(config);

export const withTransaction = async (handler) => {
  return db.transaction(async (trx) => handler(trx));
};
