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
exports.StockingController = void 0;
const common_1 = require("@nestjs/common");
const stocking_service_1 = require("./stocking.service");
const stocking_dto_1 = require("./dto/stocking.dto");
const jwt_guard_1 = require("../../common/guards/jwt.guard");
let StockingController = class StockingController {
    constructor(stockingService) {
        this.stockingService = stockingService;
    }
    findAll(filters) {
        return this.stockingService.findAll({
            page: filters.page ? parseInt(filters.page) : 1,
            pageSize: filters.limit ? parseInt(filters.limit) : 10,
            venueId: filters.venueId ? parseInt(filters.venueId) : undefined,
        });
    }
    findOne(id) {
        return this.stockingService.findOne(+id);
    }
    create(dto) {
        return this.stockingService.create(dto);
    }
    update(id, dto) {
        return this.stockingService.update(+id, dto);
    }
    delete(id) {
        return this.stockingService.delete(+id);
    }
};
exports.StockingController = StockingController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StockingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockingController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [stocking_dto_1.CreateStockingDto]),
    __metadata("design:returntype", void 0)
], StockingController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stocking_dto_1.UpdateStockingDto]),
    __metadata("design:returntype", void 0)
], StockingController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StockingController.prototype, "delete", null);
exports.StockingController = StockingController = __decorate([
    (0, common_1.Controller)('stocking'),
    __metadata("design:paramtypes", [stocking_service_1.StockingService])
], StockingController);
//# sourceMappingURL=stocking.controller.js.map