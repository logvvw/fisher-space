import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { GrowthService } from './growth.service';
import { CreateGrowthDto, UpdateGrowthDto } from './dto/growth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('growth')
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Get()
  findAll(@Query() filters: any) {
    return this.growthService.findAll({
      page: filters.page ? parseInt(filters.page) : 1,
      pageSize: filters.limit ? parseInt(filters.limit) : 10,
      venueId: filters.venueId ? parseInt(filters.venueId) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.growthService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateGrowthDto) {
    return this.growthService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGrowthDto) {
    return this.growthService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.growthService.delete(+id);
  }
}
