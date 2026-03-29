import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { VenuesModule } from './modules/venues/venues.module';
import { SpeciesModule } from './modules/species/species.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { FishInfoModule } from './modules/fish-info/fish-info.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { BannersModule } from './modules/banners/banners.module';
import { TopicsModule } from './modules/topics/topics.module';
import { StockingModule } from './modules/stocking/stocking.module';
import { GrowthModule } from './modules/growth/growth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '1234567890',
      database: 'fisher',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    VenuesModule,
    SpeciesModule,
    PricingModule,
    FishInfoModule,
    ArticlesModule,
    FavoritesModule,
    BannersModule,
    TopicsModule,
    StockingModule,
    GrowthModule,
  ],
})
export class AppModule {}
