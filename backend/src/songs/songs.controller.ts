import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SongsService } from './songs.service';

@Controller('api/songs')
export class SongsController {
  constructor(private readonly songs: SongsService) {}

  /**
   * GET /api/songs
   * Returns all songs, ordered by a given column (default: band).
   */
  @Get()
  async list(@Query('order') order: 'band' | 'name' | 'year' = 'band') {
    try {
      return await this.songs.list(order);
    } catch (e) {
      throw new BadRequestException(
        e instanceof Error ? e.message : 'Failed to fetch songs',
      );
    }
  }

  /**
   * POST /api/songs/upload
   * Uploads a CSV and saves songs to DB.
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('CSV file is required.');
    }

    if (
      !/text\/(csv|plain)|application\/vnd\.ms-excel/.test(file.mimetype || '')
    ) {
      throw new BadRequestException('Only CSV files are allowed.');
    }

    try {
      return await this.songs.uploadCsv(file);
    } catch (e) {
      throw new BadRequestException(
        e instanceof Error ? e.message : 'Failed to upload songs',
      );
    }
  }
  @Delete('clear')
  async clear() {
    try {
      return await this.songs.clearAll();
    } catch (e) {
      throw new BadRequestException(
        e instanceof Error ? e.message : 'Failed to clear songs',
      );
    }
  }
}
