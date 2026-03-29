import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';

export enum SpeciesCategory {
  FRESHWATER = 'freshwater',
  SALTWATER = 'saltwater',
}

@Entity('species')
export class Species {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueId: number;

  @ManyToOne(() => Venue)
  venue: Venue;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'enum', enum: SpeciesCategory, default: SpeciesCategory.FRESHWATER })
  category: SpeciesCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  avgWeight: number;

  @Column({ default: 0 })
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}