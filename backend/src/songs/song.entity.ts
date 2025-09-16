import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('songs')
@Unique('uq_song_band_year', ['name', 'band', 'year'])
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  band: string;

  @Column({ type: 'int' })
  year: number;
}