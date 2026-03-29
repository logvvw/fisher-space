import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { CreatePricingDto, UpdatePricingDto } from './dto/pricing.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get()
  async findAll(@Query() query: any) {
    return this.pricingService.findAll({
      venueId: query.venueId ? +query.venueId : undefined,
      type: query.type || undefined,
      page: query.page ? +query.page : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('venue/:venueId')
  create(@Param('venueId') venueId: string, @Body() dto: CreatePricingDto) {
    return this.pricingService.create({ ...dto, venueId: +venueId });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePricingDto) {
    return this.pricingService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.pricingService.delete(+id);
  }
}
