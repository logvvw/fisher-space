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
exports.FishInfoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fish_info_entity_1 = require("./entities/fish-info.entity");
let FishInfoService = class FishInfoService {
    constructor(fishInfoRepository) {
        this.fishInfoRepository = fishInfoRepository;
    }
    async create(data, userId) {
        const fishInfo = this.fishInfoRepository.create({
            ...data,
            userId,
        });
        return this.fishInfoRepository.save(fishInfo);
    }
    async findAll(venueId) {
        const query = this.fishInfoRepository
            .createQueryBuilder('fi')
            .leftJoinAndSelect('fi.venue', 'venue')
            .select(['fi', 'venue.id', 'venue.name']);
        if (venueId) {
            query.where('fi.venueId = :venueId', { venueId });
        }
        return query.orderBy('fi.isTop', 'DESC').addOrderBy('fi.createdAt', 'DESC').getMany();
    }
    async findOne(id) {
        return this.fishInfoRepository.findOne({
            where: { id },
            relations: ['venue', 'user'],
        });
    }
    async update(id, data) {
        await this.fishInfoRepository.update(id, data);
        return this.findOne(id);
    }
    async toggleTop(id) {
        const fishInfo = await this.findOne(id);
        fishInfo.isTop = !fishInfo.isTop;
        return this.fishInfoRepository.save(fishInfo);
    }
    async delete(id) {
        await this.fishInfoRepository.delete(id);
    }
};
exports.FishInfoService = FishInfoService;
exports.FishInfoService = FishInfoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fish_info_entity_1.FishInfo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FishInfoService);
//# sourceMappingURL=fish-info.service.js.map