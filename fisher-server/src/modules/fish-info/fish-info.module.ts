import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FishInfo } from './entities/fish-info.entity';
import { FishInfoService } from './fish-info.service';
import { FishInfoController } from './fish-info.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FishInfo])],
  providers: [FishInfoService],
  controllers: [FishInfoController],
  exports: [FishInfoService],
})
export class FishInfoModule {}