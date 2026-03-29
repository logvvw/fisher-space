import { FishInfoService } from './fish-info.service';
import { CreateFishInfoDto, UpdateFishInfoDto } from './dto/fish-info.dto';
export declare class FishInfoController {
    private readonly fishInfoService;
    constructor(fishInfoService: FishInfoService);
    findAll(venueId?: string): Promise<import("./entities/fish-info.entity").FishInfo[]>;
    findOne(id: string): Promise<import("./entities/fish-info.entity").FishInfo>;
    create(dto: CreateFishInfoDto, body: {
        user: any;
    }): Promise<import("./entities/fish-info.entity").FishInfo>;
    update(id: string, dto: UpdateFishInfoDto): Promise<import("./entities/fish-info.entity").FishInfo>;
    toggleTop(id: string): Promise<import("./entities/fish-info.entity").FishInfo>;
    delete(id: string): Promise<void>;
}
