import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SpeciesService } from './species.service';
import { CreateSpeciesDto, UpdateSpeciesDto } from './dto/species.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('species')
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Get()
  findAll(@Query() filters: any) {
    return this.speciesService.findAll({
      page: filters.page ? parseInt(filters.page) : 1,
      pageSize: filters.limit ? parseInt(filters.limit) : 10,
      keyword: filters.keyword,
    });
  }

  @Get('stats')
  getStats() {
    return this.speciesService.getStats();
  }

  @Get('venue/:venueId')
  findByVenue(@Param('venueId') venueId: string) {
    return this.speciesService.findByVenue(+venueId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSpeciesDto) {
    return this.speciesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('venue/:venueId')
  createForVenue(@Param('venueId') venueId: string, @Body() dto: CreateSpeciesDto) {
    return this.speciesService.create({ ...dto, venueId: +venueId });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSpeciesDto) {
    return this.speciesService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.speciesService.delete(+id);
  }
}
