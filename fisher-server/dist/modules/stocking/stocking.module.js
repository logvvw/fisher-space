"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const stocking_entity_1 = require("./entities/stocking.entity");
const stocking_service_1 = require("./stocking.service");
const stocking_controller_1 = require("./stocking.controller");
let StockingModule = class StockingModule {
};
exports.StockingModule = StockingModule;
exports.StockingModule = StockingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([stocking_entity_1.StockingRecord])],
        controllers: [stocking_controller_1.StockingController],
        providers: [stocking_service_1.StockingService],
        exports: [stocking_service_1.StockingService],
    })
], StockingModule);
//# sourceMappingURL=stocking.module.js.map