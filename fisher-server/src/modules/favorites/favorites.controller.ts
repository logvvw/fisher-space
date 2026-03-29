import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findByUser(@Body() body: { user: any }) {
    return this.favoritesService.findByUser(body.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: { venueId: number; user: any }) {
    return this.favoritesService.create(body.user.id, body.venueId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':venueId')
  delete(@Param('venueId') venueId: string, @Body() body: { user: any }) {
    return this.favoritesService.delete(body.user.id, +venueId);
  }
}