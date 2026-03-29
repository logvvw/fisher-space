import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from './entities/species.entity';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private speciesRepository: Repository<Species>,
  ) {}

  async create(data: Partial<Species>): Promise<Species> {
    const species = this.speciesRepository.create(data);
    return this.speciesRepository.save(species);
  }

  async findAll(filters?: { page?: number; pageSize?: number; keyword?: string }): Promise<{ list: Species[]; total: number }> {
    const query = this.speciesRepository.createQueryBuilder('species')
      .leftJoinAndSelect('species.venue', 'venue')
      .select(['species', 'venue.id', 'venue.name']);

    if (filters?.keyword) {
      query.andWhere('species.name LIKE :keyword', { keyword: `%${filters.keyword}%` });
    }

    const total = await query.getCount();
    
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    
    const list = await query
      .orderBy('species.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();
    
    return { list, total };
  }

  async findByVenue(venueId: number): Promise<Species[]> {
    return this.speciesRepository.find({ where: { venueId } });
  }

  async findOne(id: number): Promise<Species> {
    return this.speciesRepository.findOne({ where: { id } });
  }

  async update(id: number, data: Partial<Species>): Promise<Species> {
    await this.speciesRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.speciesRepository.delete(id);
  }

  async getStats(): Promise<any[]> {
    return this.speciesRepository.createQueryBuilder('species')
      .leftJoin('species.venue', 'venue')
      .select('venue.name', 'venueName')
      .addSelect('SUM(species.quantity)', 'totalQuantity')
      .groupBy('venue.id')
      .addGroupBy('venue.name')
      .getRawMany();
  }
}