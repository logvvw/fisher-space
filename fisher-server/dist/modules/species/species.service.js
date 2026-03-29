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
exports.SpeciesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const species_entity_1 = require("./entities/species.entity");
let SpeciesService = class SpeciesService {
    constructor(speciesRepository) {
        this.speciesRepository = speciesRepository;
    }
    async create(data) {
        const species = this.speciesRepository.create(data);
        return this.speciesRepository.save(species);
    }
    async findAll(filters) {
        const query = this.speciesRepository.createQueryBuilder('species')
            .leftJoinAndSelect('species.venue', 'venue')
            .select(['species', 'venue.id', 'venue.name']);
        if (filters?.keyword) {
            query.andWhere('species.name LIKE :keyword', { keyword: `%${filters.keyword}%` });
        }
        const total = await query.getCount();
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 10;
        const list = await query
            .orderBy('species.createdAt', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
        return { list, total };
    }
    async findByVenue(venueId) {
        return this.speciesRepository.find({ where: { venueId } });
    }
    async findOne(id) {
        return this.speciesRepository.findOne({ where: { id } });
    }
    async update(id, data) {
        await this.speciesRepository.update(id, data);
        return this.findOne(id);
    }
    async delete(id) {
        await this.speciesRepository.delete(id);
    }
    async getStats() {
        return this.speciesRepository.createQueryBuilder('species')
            .leftJoin('species.venue', 'venue')
            .select('venue.name', 'venueName')
            .addSelect('SUM(species.quantity)', 'totalQuantity')
            .groupBy('venue.id')
            .addGroupBy('venue.name')
            .getRawMany();
    }
};
exports.SpeciesService = SpeciesService;
exports.SpeciesService = SpeciesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(species_entity_1.Species)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SpeciesService);
//# sourceMappingURL=species.service.js.map