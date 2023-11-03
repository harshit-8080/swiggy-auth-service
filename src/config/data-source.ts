import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { CONFIG } from './index';
import { RefreshToken } from '../entity/RefreshToken';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: CONFIG.DB_HOST,
  port: Number(CONFIG.DB_PORT),
  username: CONFIG.DB_USERNAME,
  password: CONFIG.DB_PASSWORD,
  database: CONFIG.DB_NAME,
  // don't use this in production
  synchronize: true,
  logging: false,
  entities: [User, RefreshToken],
  migrations: [],
  subscribers: [],
});
