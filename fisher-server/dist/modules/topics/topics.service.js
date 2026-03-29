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
exports.TopicsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const topic_entity_1 = require("./entities/topic.entity");
let TopicsService = class TopicsService {
    constructor(topicRepository) {
        this.topicRepository = topicRepository;
    }
    async findAll(filters) {
        const page = Number(filters?.page) || 1;
        const pageSize = Number(filters?.pageSize) || 10;
        const qb = this.topicRepository.createQueryBuilder('topic');
        if (filters?.status) {
            qb.andWhere('topic.status = :status', { status: filters.status });
        }
        if (typeof filters?.isHot !== 'undefined' && filters.isHot !== '') {
            const isHot = filters.isHot === true || filters.isHot === 'true' || filters.isHot === 1;
            qb.andWhere('topic.is_hot = :isHot', { isHot: isHot ? 1 : 0 });
        }
        const [items, total] = await qb
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();
        return {
            items,
            total,
            page,
            pageSize,
        };
    }
    async findOne(id) {
        const topic = await this.topicRepository.findOne({ where: { id } });
        if (!topic) {
            return null;
        }
        topic.viewCount = (topic.viewCount ?? 0) + 1;
        await this.topicRepository.save(topic);
        return topic;
    }
    async create(data) {
        const topic = this.topicRepository.create({
            name: data.name,
            description: data.description,
            coverImage: data.coverImage,
            color: data.color ?? '#667eea',
            postCount: 0,
            followCount: 0,
            viewCount: 0,
            isHot: !!data.isHot,
            status: data.status ?? 'active',
        });
        return this.topicRepository.save(topic);
    }
    async update(id, data) {
        const topic = await this.topicRepository.findOne({ where: { id } });
        if (!topic) {
            return null;
        }
        Object.assign(topic, {
            name: data.name ?? topic.name,
            description: data.description ?? topic.description,
            coverImage: data.coverImage ?? topic.coverImage,
            color: data.color ?? topic.color,
            isHot: data.isHot ?? topic.isHot,
            status: data.status ?? topic.status,
        });
        await this.topicRepository.save(topic);
        return topic;
    }
    async delete(id) {
        await this.topicRepository.delete(id);
        return { deleted: true, id };
    }
};
exports.TopicsService = TopicsService;
exports.TopicsService = TopicsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(topic_entity_1.Topic)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TopicsService);
//# sourceMappingURL=topics.service.js.map