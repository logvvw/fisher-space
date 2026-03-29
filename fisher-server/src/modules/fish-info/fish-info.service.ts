import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FishInfo } from './entities/fish-info.entity';

@Injectable()
export class FishInfoService {
  constructor(
    @InjectRepository(FishInfo)
    private fishInfoRepository: Repository<FishInfo>,
  ) {}

  async create(data: Partial<FishInfo>, userId: number): Promise<FishInfo> {
    const fishInfo = this.fishInfoRepository.create({
      ...data,
      userId,
    });
    return this.fishInfoRepository.save(fishInfo);
  }

  async findAll(venueId?: number): Promise<FishInfo[]> {
    const query = this.fishInfoRepository
      .createQueryBuilder('fi')
      .leftJoinAndSelect('fi.venue', 'venue')
      .select(['fi', 'venue.id', 'venue.name']);

    if (venueId) {
      query.where('fi.venueId = :venueId', { venueId });
    }

    return query.orderBy('fi.isTop', 'DESC').addOrderBy('fi.createdAt', 'DESC').getMany();
  }

  async findOne(id: number): Promise<FishInfo> {
    return this.fishInfoRepository.findOne({
      where: { id },
      relations: ['venue', 'user'],
    });
  }

  async update(id: number, data: Partial<FishInfo>): Promise<FishInfo> {
    await this.fishInfoRepository.update(id, data);
    return this.findOne(id);
  }

  async toggleTop(id: number): Promise<FishInfo> {
    const fishInfo = await this.findOne(id);
    fishInfo.isTop = !fishInfo.isTop;
    return this.fishInfoRepository.save(fishInfo);
  }

  async delete(id: number): Promise<void> {
    await this.fishInfoRepository.delete(id);
  }
}