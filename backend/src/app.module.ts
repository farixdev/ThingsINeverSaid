import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfessionsModule } from './confessions/confessions.module';
import { Confession } from './confessions/confession.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '123',

      database: process.env.DB_NAME || 'thingsineversaid',
      entities: [Confession],
      synchronize: true, // Auto-create tables in dev (disable in production)
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,

    }),
    ConfessionsModule,
  ],
})
export class AppModule {}
