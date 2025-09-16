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

  @Get()
  async list(@Query('order') order: 'band' | 'name' | 'year' = 'band') {
    return this.songs.list(order);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('CSV file is required under field "file".');

    try {
      const csv = file.buffer.toString('utf-8');
      const records = parse(csv, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ';',
        trim: true,
      }) as Array<Record<string, string>>;

      const prepared = records.map((r, idx) => {
        const name = (r['Song Name'] || r['name'] || '').toString().toLowerCase();
        const band = (r['Band'] || r['band'] || '').toString().toLowerCase();
        const yearStr = (r['Year'] || r['year'] || '').toString().trim();
        const year = Number.parseInt(yearStr, 10);

        if (!name || !band || !Number.isFinite(year)) {
          throw new BadRequestException(`Invalid row at index ${idx}: ${JSON.stringify(r)}`);
        }
        return { name, band, year };
      });

      const result = await this.songs.upsertMany(prepared);
      return { ok: true, ...result };
    } catch (e) {
      throw new BadRequestException('Failed to parse or import CSV.');
    }
  }
}
