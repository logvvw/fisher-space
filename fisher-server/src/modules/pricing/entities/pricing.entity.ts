import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Venue } from '../../venues/entities/venue.entity';

export enum PricingType {
  PER_WEIGHT = 'per_weight',
  PER_DAY = 'per_day',
  PER_HOUR = 'per_hour',
  MEMBERSHIP = 'membership',
}

@Entity('pricing')
export class Pricing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueId: number;

  @ManyToOne(() => Venue)
  venue: Venue;

  @Column({ type: 'enum', enum: PricingType })
  type: PricingType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true, length: 20 })
  unit: string;

  @Column({ nullable: true, length: 255 })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}