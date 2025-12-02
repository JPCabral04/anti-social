import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test.local' });
} else {
  dotenv.config();
}

import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Activity } from './entities/Activity';
import { Incentive } from './entities/Incentive';
import { Connection } from './entities/Connection';
import { Comment } from './entities/Comment';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '123456',
  database: process.env.POSTGRES_DB_NAME || 'anti_social_db',

  synchronize: true,
  logging: false,
  dropSchema: process.env.NODE_ENV === 'test',
  entities: [User, Activity, Incentive, Connection, Comment],
  migrations: [],
  subscribers: [],
});
