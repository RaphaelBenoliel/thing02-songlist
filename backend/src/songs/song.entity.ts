import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from 'typeorm';

@Entity('songs')
@Unique('uq_song_band_year', ['name', 'band', 'year'])
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  @Index()
  name: string;

  @Column({ length: 200 })
  @Index()
  band: string;

  @Column('int')
  year: number;
}
