import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async create(userId: number, venueId: number): Promise<Favorite> {
    const existing = await this.favoritesRepository.findOne({
      where: { userId, venueId },
    });
    if (existing) {
      throw new ConflictException('已经收藏过该钓场');
    }
    const favorite = this.favoritesRepository.create({ userId, venueId });
    return this.favoritesRepository.save(favorite);
  }

  async findByUser(userId: number): Promise<Favorite[]> {
    return this.favoritesRepository.find({
      where: { userId },
      relations: ['venue'],
      order: { createdAt: 'DESC' },
    });
  }

  async delete(userId: number, venueId: number): Promise<void> {
    await this.favoritesRepository.delete({ userId, venueId });
  }

  async isFavorited(userId: number, venueId: number): Promise<boolean> {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, venueId },
    });
    return !!favorite;
  }
}