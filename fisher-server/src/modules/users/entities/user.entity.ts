import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  VENUE_ADMIN = 'venue_admin',
  ANGLER = 'angler',
}

export enum UserStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.ANGLER })
  role: UserRole;

  @Column({ nullable: true, length: 50 })
  nickname: string;

  @Column({ nullable: true, length: 255 })
  avatar: string;

  @Column({ nullable: true, length: 10 })
  gender: string;

  @Column({ nullable: true, length: 50 })
  province: string;

  @Column({ nullable: true, length: 50 })
  city: string;

  @Column({ nullable: true, length: 50 })
  district: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}