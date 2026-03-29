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
exports.VenuesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venue_entity_1 = require("./entities/venue.entity");
let VenuesService = class VenuesService {
    constructor(venuesRepository) {
        this.venuesRepository = venuesRepository;
    }
    async create(data, userId) {
        const venue = this.venuesRepository.create({
            ...data,
            userId,
            status: venue_entity_1.VenueStatus.PENDING,
        });
        return this.venuesRepository.save(venue);
    }
    async findAll(filters) {
        const query = this.venuesRepository.createQueryBuilder('venue')
            .leftJoinAndSelect('venue.user', 'user')
            .select(['venue', 'user.id', 'user.username', 'user.nickname']);
        if (filters?.status) {
            query.andWhere('venue.status = :status', { status: filters.status });
        }
        if (filters?.province) {
            query.andWhere('venue.province = :province', { province: filters.province });
        }
        if (filters?.city) {
            query.andWhere('venue.city = :city', { city: filters.city });
        }
        if (filters?.keyword) {
            query.andWhere('venue.name LIKE :keyword', { keyword: `%${filters.keyword}%` });
        }
        const total = await query.getCount();
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 10;
        const list = await query
            .orderBy('venue.createdAt', 'DESC')
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
        return { list, total };
    }
    async findPending() {
        return this.venuesRepository.find({
            where: { status: venue_entity_1.VenueStatus.PENDING },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByUser(userId) {
        return this.venuesRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const venue = await this.venuesRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!venue) {
            throw new common_1.NotFoundException('钓场不存在');
        }
        return venue;
    }
    async update(id, data) {
        await this.venuesRepository.update(id, data);
        return this.findOne(id);
    }
    async delete(id) {
        await this.venuesRepository.delete(id);
    }
    async approve(id) {
        await this.venuesRepository.update(id, { status: venue_entity_1.VenueStatus.APPROVED });
        return this.findOne(id);
    }
    async reject(id) {
        await this.venuesRepository.update(id, { status: venue_entity_1.VenueStatus.REJECTED });
        return this.findOne(id);
    }
    async updateStatus(id, status) {
        await this.venuesRepository.update(id, { status });
        return this.findOne(id);
    }
};
exports.VenuesService = VenuesService;
exports.VenuesService = VenuesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venue_entity_1.Venue)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VenuesService);
//# sourceMappingURL=venues.service.js.map