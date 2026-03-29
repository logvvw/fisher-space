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
exports.GrowthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const growth_entity_1 = require("./entities/growth.entity");
let GrowthService = class GrowthService {
    constructor(growthRepository) {
        this.growthRepository = growthRepository;
    }
    async create(dto) {
        const record = this.growthRepository.create(dto);
        return this.growthRepository.save(record);
    }
    async findAll(filters) {
        const query = this.growthRepository.createQueryBuilder('growth')
            .leftJoinAndSelect('growth.venue', 'venue')
            .select(['growth', 'venue.id', 'venue.name']);
        if (filters?.venueId) {
            query.andWhere('growth.venueId = :venueId', { venueId: filters.venueId });
        }
        const total = await query.getCount();
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 10;
        const list = await query
            .orderBy('growth.recordedAt', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
        return { list, total };
    }
    async findOne(id) {
        const record = await this.growthRepository.findOne({
            where: { id },
            relations: ['venue'],
        });
        if (!record)
            throw new common_1.NotFoundException('生长动态记录不存在');
        return record;
    }
    async update(id, dto) {
        await this.growthRepository.update(id, dto);
        return this.findOne(id);
    }
    async delete(id) {
        await this.growthRepository.delete(id);
    }
};
exports.GrowthService = GrowthService;
exports.GrowthService = GrowthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(growth_entity_1.GrowthRecord)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GrowthService);
//# sourceMappingURL=growth.service.js.map