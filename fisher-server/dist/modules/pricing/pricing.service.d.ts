import { Repository } from 'typeorm';
import { Pricing } from './entities/pricing.entity';
export declare class PricingService {
    private pricingRepository;
    constructor(pricingRepository: Repository<Pricing>);
    create(data: Partial<Pricing>): Promise<Pricing>;
    findAll(filters?: {
        venueId?: number;
        type?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: Pricing[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findByVenue(venueId: number): Promise<Pricing[]>;
    findOne(id: number): Promise<Pricing>;
    update(id: number, data: Partial<Pricing>): Promise<Pricing>;
    delete(id: number): Promise<void>;
}
