import { ArticleCategory, ArticleStatus } from '../entities/article.entity';
export declare class CreateArticleDto {
    title: string;
    content: string;
    summary?: string;
    cover?: string;
    category: ArticleCategory;
    tags?: string[];
    status?: ArticleStatus;
}
export declare class UpdateArticleDto {
    title?: string;
    content?: string;
    summary?: string;
    cover?: string;
    category?: ArticleCategory;
    tags?: string[];
    status?: ArticleStatus;
}
