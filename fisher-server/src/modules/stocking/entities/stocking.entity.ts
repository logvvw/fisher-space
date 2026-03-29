import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';

export enum StockingStatus {
  PENDING = 'pending',
  TRANSIT = 'transit',
  DONE = 'done',
}

@Entity('stocking_records')
export class StockingRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueId: number;

  @ManyToOne(() => Venue)
  venue: Venue;

  @Column({ length: 50 })
  fish: string; // Fish species name

  @Column()
  amount: number; // Quantity in units (fish)

  @Column({ type: 'timestamp' })
  date: Date; // Stocking date

  @Column({ length: 100, nullable: true })
  supplier: string;

  @Column({ type: 'enum', enum: StockingStatus, default: StockingStatus.PENDING })
  status: StockingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
