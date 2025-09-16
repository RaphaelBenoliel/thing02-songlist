import { Controller, Get } from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from './song.entity';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  async list(): Promise<Song[]> {
    return this.songsService.list();
  }
}
