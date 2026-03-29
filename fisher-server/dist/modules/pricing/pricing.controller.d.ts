import { PricingService } from './pricing.service';
import { CreatePricingDto, UpdatePricingDto } from './dto/pricing.dto';
export declare class PricingController {
    private readonly pricingService;
    constructor(pricingService: PricingService);
    findAll(query: any): Promise<{
        items: import("./entities/pricing.entity").Pricing[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(venueId: string, dto: CreatePricingDto): Promise<import("./entities/pricing.entity").Pricing>;
    update(id: string, dto: UpdatePricingDto): Promise<import("./entities/pricing.entity").Pricing>;
    delete(id: string): Promise<void>;
}
