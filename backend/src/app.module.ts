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
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'songsdb',
      autoLoadEntities: true,
      synchronize: true, // Note: set to false in production
    }),
    SongsModule,
  ],
})
export class AppModule {}
