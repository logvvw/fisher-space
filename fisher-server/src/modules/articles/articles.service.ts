import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleCategory, ArticleStatus } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(data: Partial<Article>, authorId: number): Promise<Article> {
    const article = this.articlesRepository.create({
      ...data,
      authorId,
    });
    return this.articlesRepository.save(article);
  }

  async findAll(filters?: { category?: string; status?: string; keyword?: string }): Promise<Article[]> {
    const query = this.articlesRepository.createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .select(['article', 'author.id', 'author.username', 'author.nickname']);

    if (filters?.category) {
      query.andWhere('article.category = :category', { category: filters.category });
    }
    if (filters?.status) {
      query.andWhere('article.status = :status', { status: filters.status });
    } else {
      query.andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED });
    }
    if (filters?.keyword) {
      query.andWhere('article.title LIKE :keyword', { keyword: `%${filters.keyword}%` });
    }

    return query.orderBy('article.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (article) {
      article.viewCount += 1;
      await this.articlesRepository.save(article);
    }
    return article;
  }

  async update(id: number, data: Partial<Article>): Promise<Article> {
    await this.articlesRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.articlesRepository.delete(id);
  }
}