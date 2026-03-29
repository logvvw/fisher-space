import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';

@Entity('growth_records')
export class GrowthRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueId: number;

  @ManyToOne(() => Venue)
  venue: Venue;

  @Column({ length: 50 })
  name: string; // Fish species name

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  currentWeight: number; // Current average weight (kg)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  lastWeight: number; // Previous average weight (kg)

  @Column({ type: 'timestamp' })
  recordedAt: Date; // Record collection date

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
