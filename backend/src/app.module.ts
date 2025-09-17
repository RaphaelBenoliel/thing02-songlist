import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SongsModule } from './songs/songs.module';

/**
 * Root application module.
 *
 * - Loads environment variables (via ConfigModule).
 * - Configures the TypeORM connection to PostgreSQL.
 * - Imports the SongsModule which handles all song-related logic.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // ON locally, OFF in prod
      logging: false,
    }),
    SongsModule,
  ],
})
export class AppModule {}
