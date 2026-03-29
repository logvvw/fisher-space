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
exports.PricingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pricing_entity_1 = require("./entities/pricing.entity");
let PricingService = class PricingService {
    constructor(pricingRepository) {
        this.pricingRepository = pricingRepository;
    }
    async create(data) {
        const pricing = this.pricingRepository.create(data);
        return this.pricingRepository.save(pricing);
    }
    async findAll(filters) {
        const query = this.pricingRepository.createQueryBuilder('pricing');
        if (filters?.venueId) {
            query.andWhere('pricing.venueId = :venueId', { venueId: filters.venueId });
        }
        if (filters?.type) {
            query.andWhere('pricing.type = :type', { type: filters.type });
        }
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 10;
        const [items, total] = await query.skip((page - 1) * pageSize).take(pageSize).orderBy('pricing.createdAt', 'DESC').getManyAndCount();
        return { items, total, page, pageSize };
    }
    async findByVenue(venueId) {
        return this.pricingRepository.find({ where: { venueId }, order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        return this.pricingRepository.findOne({ where: { id } });
    }
    async update(id, data) {
        await this.pricingRepository.update(id, data);
        return this.findOne(id);
    }
    async delete(id) {
        await this.pricingRepository.delete(id);
    }
};
exports.PricingService = PricingService;
exports.PricingService = PricingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pricing_entity_1.Pricing)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PricingService);
//# sourceMappingURL=pricing.service.js.map