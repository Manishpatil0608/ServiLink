import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sharedConfig = {
  client: 'mysql2',
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds')
  },
  pool: {
    min: 2,
    max: 10
  }
};

const connection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  supportBigNumbers: true
};

export default {
  development: {
    ...sharedConfig,
    connection
  },
  test: {
    ...sharedConfig,
    connection: {
      ...connection,
      database: `${process.env.DB_NAME || 'local_services'}_test`
    }
  },
  production: {
    ...sharedConfig,
    connection: {
      ...connection,
      ssl: process.env.DB_SSL === 'true'
    }
  }
};
