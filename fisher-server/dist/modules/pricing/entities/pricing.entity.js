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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pricing = exports.PricingType = void 0;
const typeorm_1 = require("typeorm");
const venue_entity_1 = require("../../venues/entities/venue.entity");
var PricingType;
(function (PricingType) {
    PricingType["PER_WEIGHT"] = "per_weight";
    PricingType["PER_DAY"] = "per_day";
    PricingType["PER_HOUR"] = "per_hour";
    PricingType["MEMBERSHIP"] = "membership";
})(PricingType || (exports.PricingType = PricingType = {}));
let Pricing = class Pricing {
};
exports.Pricing = Pricing;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pricing.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Pricing.prototype, "venueId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venue_entity_1.Venue),
    __metadata("design:type", venue_entity_1.Venue)
], Pricing.prototype, "venue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PricingType }),
    __metadata("design:type", String)
], Pricing.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Pricing.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], Pricing.prototype, "unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], Pricing.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Pricing.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pricing.prototype, "createdAt", void 0);
exports.Pricing = Pricing = __decorate([
    (0, typeorm_1.Entity)('pricing')
], Pricing);
//# sourceMappingURL=pricing.entity.js.map