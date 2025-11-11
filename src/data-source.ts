import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test.local' });
} else {
  dotenv.config();
}

import { DataSource } from 'typeorm';
import { Usuario } from './entities/Usuario';
import { Atividade } from './entities/Atividade';
import { Incentivo } from './entities/Incentivo';
import { Conexao } from './entities/Conexao';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.NODE_ENV === 'test'
      ? process.env.DATABASE_URL_TEST
      : process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  dropSchema: process.env.NODE_ENV === 'test',
  entities: [Usuario, Atividade, Incentivo, Conexao],
});
