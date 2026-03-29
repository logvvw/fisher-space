import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockingRecord } from './entities/stocking.entity';
import { CreateStockingDto, UpdateStockingDto } from './dto/stocking.dto';

@Injectable()
export class StockingService {
  constructor(
    @InjectRepository(StockingRecord)
    private stockingRepository: Repository<StockingRecord>,
  ) {}

  async create(dto: CreateStockingDto): Promise<StockingRecord> {
    const record = this.stockingRepository.create(dto);
    return this.stockingRepository.save(record);
  }

  async findAll(filters?: { page?: number; pageSize?: number; venueId?: number }): Promise<{ list: StockingRecord[]; total: number }> {
    const query = this.stockingRepository.createQueryBuilder('stocking')
      .leftJoinAndSelect('stocking.venue', 'venue')
      .select(['stocking', 'venue.id', 'venue.name']);

    if (filters?.venueId) {
      query.andWhere('stocking.venueId = :venueId', { venueId: filters.venueId });
    }

    const total = await query.getCount();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;

    const list = await query
      .orderBy('stocking.date', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return { list, total };
  }

  async findOne(id: number): Promise<StockingRecord> {
    const record = await this.stockingRepository.findOne({
      where: { id },
      relations: ['venue'],
    });
    if (!record) throw new NotFoundException('投放记录不存在');
    return record;
  }

  async update(id: number, dto: UpdateStockingDto): Promise<StockingRecord> {
    await this.stockingRepository.update(id, dto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.stockingRepository.delete(id);
  }
}
