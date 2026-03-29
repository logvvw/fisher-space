import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ArticleCategory {
  TECHNIQUE = 'technique',
  ENCYCLOPEDIA = 'encyclopedia',
  NEWS = 'news',
}

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true, length: 500 })
  summary: string;

  @Column({ nullable: true, length: 255 })
  cover: string;

  @Column({ type: 'enum', enum: ArticleCategory })
  category: ArticleCategory;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ nullable: true })
  authorId: number;

  @ManyToOne(() => User)
  author: User;

  @Column({ type: 'enum', enum: ArticleStatus, default: ArticleStatus.DRAFT })
  status: ArticleStatus;

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}