import { Repository } from 'typeorm';
import { Banner, BannerPosition } from './entities/banner.entity';
export declare class BannersService {
    private bannersRepository;
    constructor(bannersRepository: Repository<Banner>);
    create(data: Partial<Banner>): Promise<Banner>;
    findAll(position?: BannerPosition): Promise<Banner[]>;
    findOne(id: number): Promise<Banner>;
    update(id: number, data: Partial<Banner>): Promise<Banner>;
    delete(id: number): Promise<void>;
}
