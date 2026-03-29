import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pricing } from './entities/pricing.entity';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(Pricing)
    private pricingRepository: Repository<Pricing>,
  ) {}

  async create(data: Partial<Pricing>): Promise<Pricing> {
    const pricing = this.pricingRepository.create(data);
    return this.pricingRepository.save(pricing);
  }

  async findAll(filters?: { venueId?: number; type?: string; page?: number; pageSize?: number }) {
    const query = this.pricingRepository.createQueryBuilder('pricing');
    if (filters?.venueId) {
      query.andWhere('pricing.venueId = :venueId', { venueId: filters.venueId });
    }
    if (filters?.type) {
      query.andWhere('pricing.type = :type', { type: filters.type });
    }
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const [items, total] = await query.skip((page - 1) * pageSize).take(pageSize).orderBy('pricing.createdAt', 'DESC').getManyAndCount();
    return { items, total, page, pageSize };
  }

  async findByVenue(venueId: number): Promise<Pricing[]> {
    return this.pricingRepository.find({ where: { venueId }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Pricing> {
    return this.pricingRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Pricing>): Promise<Pricing> {
    await this.pricingRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.pricingRepository.delete(id);
  }
}