import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StockingService } from './stocking.service';
import { CreateStockingDto, UpdateStockingDto } from './dto/stocking.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('stocking')
export class StockingController {
  constructor(private readonly stockingService: StockingService) {}

  @Get()
  findAll(@Query() filters: any) {
    return this.stockingService.findAll({
      page: filters.page ? parseInt(filters.page) : 1,
      pageSize: filters.limit ? parseInt(filters.limit) : 10,
      venueId: filters.venueId ? parseInt(filters.venueId) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockingService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateStockingDto) {
    return this.stockingService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateStockingDto) {
    return this.stockingService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.stockingService.delete(+id);
  }
}
