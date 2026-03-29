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
exports.FishInfoController = void 0;
const common_1 = require("@nestjs/common");
const fish_info_service_1 = require("./fish-info.service");
const fish_info_dto_1 = require("./dto/fish-info.dto");
const jwt_guard_1 = require("../../common/guards/jwt.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let FishInfoController = class FishInfoController {
    constructor(fishInfoService) {
        this.fishInfoService = fishInfoService;
    }
    findAll(venueId) {
        return this.fishInfoService.findAll(venueId ? +venueId : undefined);
    }
    findOne(id) {
        return this.fishInfoService.findOne(+id);
    }
    create(dto, body) {
        return this.fishInfoService.create(dto, body.user.id);
    }
    update(id, dto) {
        return this.fishInfoService.update(+id, dto);
    }
    toggleTop(id) {
        return this.fishInfoService.toggleTop(+id);
    }
    delete(id) {
        return this.fishInfoService.delete(+id);
    }
};
exports.FishInfoController = FishInfoController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('venueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FishInfoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FishInfoController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fish_info_dto_1.CreateFishInfoDto, Object]),
    __metadata("design:returntype", void 0)
], FishInfoController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, fish_info_dto_1.UpdateFishInfoDto]),
    __metadata("design:returntype", void 0)
], FishInfoController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.VENUE_ADMIN),
    (0, common_1.Put)(':id/top'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FishInfoController.prototype, "toggleTop", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FishInfoController.prototype, "delete", null);
exports.FishInfoController = FishInfoController = __decorate([
    (0, common_1.Controller)('fish-infos'),
    __metadata("design:paramtypes", [fish_info_service_1.FishInfoService])
], FishInfoController);
//# sourceMappingURL=fish-info.controller.js.map