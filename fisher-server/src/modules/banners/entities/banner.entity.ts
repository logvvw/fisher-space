import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum BannerPosition {
  HOME_LEISURE = 'home_leisure',
  HOME_BUSINESS = 'home_business',
}

export enum BannerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, length: 100 })
  title: string;

  @Column({ length: 255 })
  image: string;

  @Column({ nullable: true, length: 255 })
  link: string;

  @Column({ type: 'enum', enum: BannerPosition, default: BannerPosition.HOME_LEISURE })
  position: BannerPosition;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ type: 'enum', enum: BannerStatus, default: BannerStatus.ACTIVE })
  status: BannerStatus;

  @CreateDateColumn()
  createdAt: Date;
}