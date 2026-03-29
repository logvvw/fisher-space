import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrowthRecord } from './entities/growth.entity';
import { CreateGrowthDto, UpdateGrowthDto } from './dto/growth.dto';

@Injectable()
export class GrowthService {
  constructor(
    @InjectRepository(GrowthRecord)
    private growthRepository: Repository<GrowthRecord>,
  ) {}

  async create(dto: CreateGrowthDto): Promise<GrowthRecord> {
    const record = this.growthRepository.create(dto);
    return this.growthRepository.save(record);
  }

  async findAll(filters?: { page?: number; pageSize?: number; venueId?: number }): Promise<{ list: GrowthRecord[]; total: number }> {
    const query = this.growthRepository.createQueryBuilder('growth')
      .leftJoinAndSelect('growth.venue', 'venue')
      .select(['growth', 'venue.id', 'venue.name']);

    if (filters?.venueId) {
      query.andWhere('growth.venueId = :venueId', { venueId: filters.venueId });
    }

    const total = await query.getCount();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;

    const list = await query
      .orderBy('growth.recordedAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return { list, total };
  }

  async findOne(id: number): Promise<GrowthRecord> {
    const record = await this.growthRepository.findOne({
      where: { id },
      relations: ['venue'],
    });
    if (!record) throw new NotFoundException('生长动态记录不存在');
    return record;
  }

  async update(id: number, dto: UpdateGrowthDto): Promise<GrowthRecord> {
    await this.growthRepository.update(id, dto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.growthRepository.delete(id);
  }
}
