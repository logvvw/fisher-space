import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockingRecord } from './entities/stocking.entity';
import { StockingService } from './stocking.service';
import { StockingController } from './stocking.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StockingRecord])],
  controllers: [StockingController],
  providers: [StockingService],
  exports: [StockingService],
})
export class StockingModule {}
