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
export declare class TopicsService {
    private readonly topicRepository;
    constructor(topicRepository: Repository<Topic>);
    findAll(filters: any): Promise<{
        items: Topic[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: number): Promise<Topic>;
    create(data: CreateTopicDto): Promise<Topic>;
    update(id: number, data: UpdateTopicDto): Promise<Topic>;
    delete(id: number): Promise<{
        deleted: boolean;
        id: number;
    }>;
}
