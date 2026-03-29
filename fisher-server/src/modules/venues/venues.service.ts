import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue, VenueStatus } from './entities/venue.entity';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private venuesRepository: Repository<Venue>,
  ) {}

  async create(data: Partial<Venue>, userId: number): Promise<Venue> {
    const venue = this.venuesRepository.create({
      ...data,
      userId,
      status: VenueStatus.PENDING,
    });
    return this.venuesRepository.save(venue);
  }

  async findAll(filters?: { 
    province?: string; 
    city?: string; 
    keyword?: string; 
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ list: Venue[]; total: number }> {
    const query = this.venuesRepository.createQueryBuilder('venue')
      .leftJoinAndSelect('venue.user', 'user')
      .select(['venue', 'user.id', 'user.username', 'user.nickname']);

    if (filters?.status) {
      query.andWhere('venue.status = :status', { status: filters.status });
    }
    
    if (filters?.province) {
      query.andWhere('venue.province = :province', { province: filters.province });
    }
    if (filters?.city) {
      query.andWhere('venue.city = :city', { city: filters.city });
    }
    if (filters?.keyword) {
      query.andWhere('venue.name LIKE :keyword', { keyword: `%${filters.keyword}%` });
    }
    
    const total = await query.getCount();
    
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    
    const list = await query
      .orderBy('venue.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();
    
    return { list, total };
  }

  async findPending(): Promise<Venue[]> {
    return this.venuesRepository.find({
      where: { status: VenueStatus.PENDING },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Venue[]> {
    return this.venuesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Venue> {
    const venue = await this.venuesRepository.findOne({ 
      where: { id },
      relations: ['user'],
    });
    if (!venue) {
      throw new NotFoundException('钓场不存在');
    }
    return venue;
  }

  async update(id: number, data: Partial<Venue>): Promise<Venue> {
    await this.venuesRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.venuesRepository.delete(id);
  }

  async approve(id: number): Promise<Venue> {
    await this.venuesRepository.update(id, { status: VenueStatus.APPROVED });
    return this.findOne(id);
  }

  async reject(id: number): Promise<Venue> {
    await this.venuesRepository.update(id, { status: VenueStatus.REJECTED });
    return this.findOne(id);
  }

  async updateStatus(id: number, status: VenueStatus): Promise<Venue> {
    await this.venuesRepository.update(id, { status });
    return this.findOne(id);
  }
}