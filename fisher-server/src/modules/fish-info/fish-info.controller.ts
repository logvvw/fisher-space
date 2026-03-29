import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FishInfoService } from './fish-info.service';
import { CreateFishInfoDto, UpdateFishInfoDto } from './dto/fish-info.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('fish-infos')
export class FishInfoController {
  constructor(private readonly fishInfoService: FishInfoService) {}

  @Get()
  findAll(@Query('venueId') venueId?: string) {
    return this.fishInfoService.findAll(venueId ? +venueId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fishInfoService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFishInfoDto, @Body() body: { user: any }) {
    return this.fishInfoService.create(dto, body.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFishInfoDto) {
    return this.fishInfoService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.VENUE_ADMIN)
  @Put(':id/top')
  toggleTop(@Param('id') id: string) {
    return this.fishInfoService.toggleTop(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.fishInfoService.delete(+id);
  }
}
