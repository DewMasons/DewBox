// filepath: c:\Users\user\Desktop\nestjs-sqlserver-app\nestjs-sqlserver-app\src\config\database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: true,
  options: {
    encrypt: true, // Use this if you're on Windows Azure
  },
};