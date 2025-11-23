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
  url:
    process.env.NODE_ENV === 'test'
      ? process.env.DATABASE_URL_TEST
      : process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  dropSchema: process.env.NODE_ENV === 'test',
  entities: [User, Activity, Incentive, Connection, Comment],
});
