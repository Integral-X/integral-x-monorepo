import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  schema: process.env.DB_SCHEMA || 'ebay',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Set to false in production
}); 