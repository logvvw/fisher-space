"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FishInfoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const fish_info_entity_1 = require("./entities/fish-info.entity");
const fish_info_service_1 = require("./fish-info.service");
const fish_info_controller_1 = require("./fish-info.controller");
let FishInfoModule = class FishInfoModule {
};
exports.FishInfoModule = FishInfoModule;
exports.FishInfoModule = FishInfoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([fish_info_entity_1.FishInfo])],
        providers: [fish_info_service_1.FishInfoService],
        controllers: [fish_info_controller_1.FishInfoController],
        exports: [fish_info_service_1.FishInfoService],
    })
], FishInfoModule);
//# sourceMappingURL=fish-info.module.js.map