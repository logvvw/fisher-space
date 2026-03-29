import { BannersService } from './banners.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    findAll(position?: string): Promise<import("./entities/banner.entity").Banner[]>;
    findOne(id: string): Promise<import("./entities/banner.entity").Banner>;
    create(dto: CreateBannerDto): Promise<import("./entities/banner.entity").Banner>;
    update(id: string, dto: UpdateBannerDto): Promise<import("./entities/banner.entity").Banner>;
    delete(id: string): Promise<void>;
}
