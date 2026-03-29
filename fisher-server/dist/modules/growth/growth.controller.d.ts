import { GrowthService } from './growth.service';
import { CreateGrowthDto, UpdateGrowthDto } from './dto/growth.dto';
export declare class GrowthController {
    private readonly growthService;
    constructor(growthService: GrowthService);
    findAll(filters: any): Promise<{
        list: import("./entities/growth.entity").GrowthRecord[];
        total: number;
    }>;
    findOne(id: string): Promise<import("./entities/growth.entity").GrowthRecord>;
    create(dto: CreateGrowthDto): Promise<import("./entities/growth.entity").GrowthRecord>;
    update(id: string, dto: UpdateGrowthDto): Promise<import("./entities/growth.entity").GrowthRecord>;
    delete(id: string): Promise<void>;
}
