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

  async list(): Promise<Song[]> {
    return this.repo.find({ order: { band: 'ASC' } });
  }

  async addMany(songs: Song[]) {
    return this.repo.save(songs);
  }
}
