import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';

type OrderKey = 'band' | 'name' | 'year';

@Injectable()
export class SongsService {
  constructor(@InjectRepository(Song) private readonly repo: Repository<Song>) {}

  async list(orderBy: OrderKey = 'band'): Promise<Song[]> {
    // guard בזמן ריצה – שלא יתנו key לא קיים
    const valid: OrderKey[] = ['band', 'name', 'year'];
    const key: OrderKey = valid.includes(orderBy) ? orderBy : 'band';

    return this.repo.find({ order: { [key]: 'ASC' } });
  }

  async upsertMany(rows: Array<{ name: string; band: string; year: number }>) {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new BadRequestException('No rows to upsert.');
    }
    try {
      // במטלה זה מספיק; (מומלץ גם unique constraint על name+band+year ב-entity)
      await this.repo.upsert(rows, ['name', 'band', 'year']);
      return { total: rows.length };
    } catch (e) {
      throw new BadRequestException('Failed to save songs to the database.');
    }
  }
}
