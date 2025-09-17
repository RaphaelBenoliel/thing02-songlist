import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { parse } from 'csv-parse/sync';
import { SongsService } from './songs.service';

@Controller('api/songs')
export class SongsController {
  constructor(private readonly songs: SongsService) {}

  /**
   * GET /api/songs
   * Returns a list of all songs, ordered by the given query param.
   * @param order - The column to order by ('band' | 'name' | 'year')
   */
  @Get()
  async list(@Query('order') order: 'band' | 'name' | 'year' = 'band') {
    return this.songs.list(order);
  }

  /**
   * POST /api/songs/upload
   * Upload a CSV file containing songs.
   * Expected headers: Song Name | name, Band | band, Year | year
   * - Converts values to lowercase
   * - Validates that year is numeric
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('CSV file is required.');
    if (
      !/text\/(csv|plain)|application\/vnd\.ms-excel/.test(file.mimetype || '')
    ) {
      throw new BadRequestException('Only CSV files are allowed.');
    }

    try {
      const sample = file.buffer.toString('utf8').split('\n')[0];
      let delimiter = ',';
      if (sample.includes(';')) delimiter = ';';
      if (sample.includes('\t')) delimiter = '\t';

      // Parse CSV
      const records: Record<string, string>[] = parse(file.buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter,
      });

      const prepared = records.map((r, idx) => {
        const name = (r['name'] || r['Name'] || r['Song Name'] || '')
          .toString()
          .toLowerCase();

        const band = (r['band'] || r['Band'] || '').toString().toLowerCase();

        const yearStr = (r['year'] || r['Year'] || '').toString().trim();
        const year = Number.parseInt(yearStr, 10);

        if (!name || !band || !Number.isFinite(year)) {
          throw new BadRequestException(
            `Invalid row at index ${idx}: ${JSON.stringify(r)}`,
          );
        }

        return { name, band, year };
      });

      const result = await this.songs.upsertMany(prepared);
      return { ok: true, ...result };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Failed to parse or import CSV: ${error.message}`,
        );
      }
      throw new BadRequestException('Failed to parse or import CSV.');
    }
  }
}
