"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const venues_module_1 = require("./modules/venues/venues.module");
const species_module_1 = require("./modules/species/species.module");
const pricing_module_1 = require("./modules/pricing/pricing.module");
const fish_info_module_1 = require("./modules/fish-info/fish-info.module");
const articles_module_1 = require("./modules/articles/articles.module");
const favorites_module_1 = require("./modules/favorites/favorites.module");
const banners_module_1 = require("./modules/banners/banners.module");
const topics_module_1 = require("./modules/topics/topics.module");
const stocking_module_1 = require("./modules/stocking/stocking.module");
const growth_module_1 = require("./modules/growth/growth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: '127.0.0.1',
                port: 3306,
                username: 'root',
                password: '1234567890',
                database: 'fisher',
                autoLoadEntities: true,
                synchronize: true,
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            venues_module_1.VenuesModule,
            species_module_1.SpeciesModule,
            pricing_module_1.PricingModule,
            fish_info_module_1.FishInfoModule,
            articles_module_1.ArticlesModule,
            favorites_module_1.FavoritesModule,
            banners_module_1.BannersModule,
            topics_module_1.TopicsModule,
            stocking_module_1.StockingModule,
            growth_module_1.GrowthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map