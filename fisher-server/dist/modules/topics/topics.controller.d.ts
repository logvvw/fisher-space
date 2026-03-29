import { TopicsService, CreateTopicDto, UpdateTopicDto } from './topics.service';
export declare class TopicsController {
    private readonly topicsService;
    constructor(topicsService: TopicsService);
    findAll(query: any): Promise<{
        items: import("./entities/topic.entity").Topic[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<import("./entities/topic.entity").Topic>;
    create(dto: CreateTopicDto): Promise<import("./entities/topic.entity").Topic>;
    update(id: string, dto: UpdateTopicDto): Promise<import("./entities/topic.entity").Topic>;
    delete(id: string): Promise<{
        deleted: boolean;
        id: number;
    }>;
}
