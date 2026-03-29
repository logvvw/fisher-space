"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("./entities/article.entity");
let ArticlesService = class ArticlesService {
    constructor(articlesRepository) {
        this.articlesRepository = articlesRepository;
    }
    async create(data, authorId) {
        const article = this.articlesRepository.create({
            ...data,
            authorId,
        });
        return this.articlesRepository.save(article);
    }
    async findAll(filters) {
        const query = this.articlesRepository.createQueryBuilder('article')
            .leftJoinAndSelect('article.author', 'author')
            .select(['article', 'author.id', 'author.username', 'author.nickname']);
        if (filters?.category) {
            query.andWhere('article.category = :category', { category: filters.category });
        }
        if (filters?.status) {
            query.andWhere('article.status = :status', { status: filters.status });
        }
        else {
            query.andWhere('article.status = :status', { status: article_entity_1.ArticleStatus.PUBLISHED });
        }
        if (filters?.keyword) {
            query.andWhere('article.title LIKE :keyword', { keyword: `%${filters.keyword}%` });
        }
        return query.orderBy('article.createdAt', 'DESC').getMany();
    }
    async findOne(id) {
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
    async update(id, data) {
        await this.articlesRepository.update(id, data);
        return this.findOne(id);
    }
    async delete(id) {
        await this.articlesRepository.delete(id);
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map