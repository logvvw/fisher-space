import { Repository } from 'typeorm';
import { GrowthRecord } from './entities/growth.entity';
import { CreateGrowthDto, UpdateGrowthDto } from './dto/growth.dto';
export declare class GrowthService {
    private growthRepository;
    constructor(growthRepository: Repository<GrowthRecord>);
    create(dto: CreateGrowthDto): Promise<GrowthRecord>;
    findAll(filters?: {
        page?: number;
        pageSize?: number;
        venueId?: number;
    }): Promise<{
        list: GrowthRecord[];
        total: number;
    }>;
    findOne(id: number): Promise<GrowthRecord>;
    update(id: number, dto: UpdateGrowthDto): Promise<GrowthRecord>;
    delete(id: number): Promise<void>;
}
