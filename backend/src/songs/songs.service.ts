import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parse } from 'csv-parse/sync';
import { Song } from './song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly repo: Repository<Song>,
  ) {}

  async list(orderBy: 'band' | 'name' | 'year' = 'band'): Promise<Song[]> {
    try {
      return await this.repo.find({ order: { [orderBy]: 'ASC' } });
    } catch (e) {
      throw new BadRequestException('Failed to fetch songs from database.');
    }
  }

  async upsertMany(rows: Array<{ name: string; band: string; year: number }>) {
    if (!rows || rows.length === 0) {
      throw new BadRequestException('No rows to insert.');
    }
    try {
      await this.repo.upsert(rows, ['name', 'band', 'year']);
      return { total: rows.length };
    } catch (e) {
      throw new BadRequestException('Failed to save songs to database.');
    }
  }

  async uploadCsv(file: Express.Multer.File) {
    let records: Record<string, string>[];
    try {
      // detect delimiter
      const sample = file.buffer.toString('utf8').split('\n')[0];
      let delimiter = ',';
      if (sample.includes(';')) delimiter = ';';
      if (sample.includes('\t')) delimiter = '\t';

      records = parse(file.buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter,
      });
    } catch (e) {
      throw new BadRequestException('CSV parsing failed.');
    }

    let prepared: Array<{ name: string; band: string; year: number }>;
    try {
      prepared = records.map((r, idx) => {
        const name = (r['name'] || r['Name'] || r['Song Name'] || '')
          .toString()
          .toLowerCase();
        const band = (r['band'] || r['Band'] || '').toString().toLowerCase();
        const yearStr = (r['year'] || r['Year'] || '').toString().trim();
        const year = Number.parseInt(yearStr, 10);

        if (!name || !band || !Number.isFinite(year)) {
          throw new Error(`Invalid row at index ${idx}: ${JSON.stringify(r)}`);
        }
        return { name, band, year };
      });
    } catch (e) {
      throw new BadRequestException(
        e instanceof Error ? e.message : 'Validation failed.',
      );
    }

    try {
      const result = await this.upsertMany(prepared);
      const songs = await this.list('band');
      return { ok: true, ...result, songs };
    } catch (e) {
      throw new BadRequestException(
        e instanceof Error ? e.message : 'Database operation failed.',
      );
    }
  }
  async clearAll() {
    try {
      await this.repo.clear(); // deletes all rows in songs table
      return { ok: true, message: 'All songs cleared.' };
    } catch (e) {
      throw new BadRequestException('Could not clear songs.');
    }
  }
}
