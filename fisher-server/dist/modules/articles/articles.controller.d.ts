import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    findAll(filters: any): Promise<import("./entities/article.entity").Article[]>;
    findOne(id: string): Promise<import("./entities/article.entity").Article>;
    create(dto: CreateArticleDto, body: {
        user: any;
    }): Promise<import("./entities/article.entity").Article>;
    update(id: string, dto: UpdateArticleDto): Promise<import("./entities/article.entity").Article>;
    delete(id: string): Promise<void>;
}
