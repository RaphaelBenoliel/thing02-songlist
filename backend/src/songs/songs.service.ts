import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private readonly repo: Repository<Song>,
  ) {}

  /**
   * Returns a list of songs ordered by a given field.
   * @param orderBy - Field to order by (band | name | year). Defaults to 'band'.
   */
  async list(orderBy: 'band' | 'name' | 'year' = 'band'): Promise<Song[]> {
    return this.repo.find({ order: { [orderBy]: 'ASC' } });
  }

  /**
   * Inserts or updates multiple songs in the database.
   * Ensures no duplicates by using (name, band, year) as a composite key.
   * @param rows - Array of songs (name, band, year).
   * @returns number of inserted/updated records
   */
  async upsertMany(rows: Array<{ name: string; band: string; year: number }>) {
    await this.repo.upsert(rows, ['name', 'band', 'year']);
    return { total: rows.length };
  }
}
