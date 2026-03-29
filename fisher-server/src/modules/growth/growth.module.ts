import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrowthRecord } from './entities/growth.entity';
import { GrowthService } from './growth.service';
import { GrowthController } from './growth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GrowthRecord])],
  controllers: [GrowthController],
  providers: [GrowthService],
  exports: [GrowthService],
})
export class GrowthModule {}
