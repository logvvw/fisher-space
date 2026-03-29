import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner, BannerPosition, BannerStatus } from './entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private bannersRepository: Repository<Banner>,
  ) {}

  async create(data: Partial<Banner>): Promise<Banner> {
    const banner = this.bannersRepository.create(data);
    return this.bannersRepository.save(banner);
  }

  async findAll(position?: BannerPosition): Promise<Banner[]> {
    const query = this.bannersRepository.createQueryBuilder('banner');
    
    if (position) {
      query.where('banner.position = :position', { position });
    }
    
    return query.orderBy('banner.sortOrder', 'ASC').getMany();
  }

  async findOne(id: number): Promise<Banner> {
    return this.bannersRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Banner>): Promise<Banner> {
    await this.bannersRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.bannersRepository.delete(id);
  }
}