import { Repository } from 'typeorm';
import { FishInfo } from './entities/fish-info.entity';
export declare class FishInfoService {
    private fishInfoRepository;
    constructor(fishInfoRepository: Repository<FishInfo>);
    create(data: Partial<FishInfo>, userId: number): Promise<FishInfo>;
    findAll(venueId?: number): Promise<FishInfo[]>;
    findOne(id: number): Promise<FishInfo>;
    update(id: number, data: Partial<FishInfo>): Promise<FishInfo>;
    toggleTop(id: number): Promise<FishInfo>;
    delete(id: number): Promise<void>;
}
