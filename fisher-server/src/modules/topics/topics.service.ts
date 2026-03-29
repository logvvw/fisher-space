import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';

export interface CreateTopicDto {
  name: string;
  description?: string;
  coverImage?: string;
  color?: string;
  isHot?: boolean;
  status?: 'active' | 'inactive';
}

export interface UpdateTopicDto {
  name?: string;
  description?: string;
  coverImage?: string;
  color?: string;
  isHot?: boolean;
  status?: 'active' | 'inactive';
}

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async findAll(filters: any) {
    const page = Number(filters?.page) || 1;
    const pageSize = Number(filters?.pageSize) || 10;
    const qb = this.topicRepository.createQueryBuilder('topic');

    if (filters?.status) {
      qb.andWhere('topic.status = :status', { status: filters.status });
    }
    if (typeof filters?.isHot !== 'undefined' && filters.isHot !== '') {
      const isHot = filters.isHot === true || filters.isHot === 'true' || filters.isHot === 1;
      qb.andWhere('topic.is_hot = :isHot', { isHot: isHot ? 1 : 0 });
    }

    const [items, total] = await qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      pageSize,
    };
  }

  async findOne(id: number) {
    const topic = await this.topicRepository.findOne({ where: { id } });
    if (!topic) {
      return null;
    }
    topic.viewCount = (topic.viewCount ?? 0) + 1;
    await this.topicRepository.save(topic);
    return topic;
  }

  async create(data: CreateTopicDto) {
    const topic = this.topicRepository.create({
      name: data.name,
      description: data.description,
      coverImage: data.coverImage,
      color: data.color ?? '#667eea',
      postCount: 0,
      followCount: 0,
      viewCount: 0,
      isHot: !!data.isHot,
      status: data.status ?? 'active',
    });
    return this.topicRepository.save(topic);
  }

  async update(id: number, data: UpdateTopicDto) {
    const topic = await this.topicRepository.findOne({ where: { id } });
    if (!topic) {
      return null;
    }
    Object.assign(topic, {
      name: data.name ?? topic.name,
      description: data.description ?? topic.description,
      coverImage: data.coverImage ?? topic.coverImage,
      color: data.color ?? topic.color,
      isHot: data.isHot ?? topic.isHot,
      status: data.status ?? topic.status,
    });
    await this.topicRepository.save(topic);
    return topic;
  }

  async delete(id: number) {
    await this.topicRepository.delete(id);
    return { deleted: true, id };
  }
}
