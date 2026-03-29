import { User } from '../../users/entities/user.entity';
export declare enum ArticleCategory {
    TECHNIQUE = "technique",
    ENCYCLOPEDIA = "encyclopedia",
    NEWS = "news"
}
export declare enum ArticleStatus {
    DRAFT = "draft",
    PUBLISHED = "published"
}
export declare class Article {
    id: number;
    title: string;
    content: string;
    summary: string;
    cover: string;
    category: ArticleCategory;
    tags: string[];
    authorId: number;
    author: User;
    status: ArticleStatus;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
