import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
export declare class ArticlesService {
    private articlesRepository;
    constructor(articlesRepository: Repository<Article>);
    create(data: Partial<Article>, authorId: number): Promise<Article>;
    findAll(filters?: {
        category?: string;
        status?: string;
        keyword?: string;
    }): Promise<Article[]>;
    findOne(id: number): Promise<Article>;
    update(id: number, data: Partial<Article>): Promise<Article>;
    delete(id: number): Promise<void>;
}
