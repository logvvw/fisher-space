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
exports.Topic = void 0;
const typeorm_1 = require("typeorm");
let Topic = class Topic {
};
exports.Topic = Topic;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Topic.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Topic.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Topic.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cover_image', nullable: true }),
    __metadata("design:type", String)
], Topic.prototype, "coverImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#667eea' }),
    __metadata("design:type", String)
], Topic.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_count', default: 0 }),
    __metadata("design:type", Number)
], Topic.prototype, "postCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'follow_count', default: 0 }),
    __metadata("design:type", Number)
], Topic.prototype, "followCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'view_count', default: 0 }),
    __metadata("design:type", Number)
], Topic.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_hot', type: 'tinyint', width: 1, default: 0 }),
    __metadata("design:type", Boolean)
], Topic.prototype, "isHot", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['active', 'inactive'], default: 'active' }),
    __metadata("design:type", String)
], Topic.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Topic.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Topic.prototype, "updatedAt", void 0);
exports.Topic = Topic = __decorate([
    (0, typeorm_1.Entity)({ name: 'topics' })
], Topic);
//# sourceMappingURL=topic.entity.js.map