import { Repository } from 'typeorm';
import { Species } from './entities/species.entity';
export declare class SpeciesService {
    private speciesRepository;
    constructor(speciesRepository: Repository<Species>);
    create(data: Partial<Species>): Promise<Species>;
    findAll(filters?: {
        page?: number;
        pageSize?: number;
        keyword?: string;
    }): Promise<{
        list: Species[];
        total: number;
    }>;
    findByVenue(venueId: number): Promise<Species[]>;
    findOne(id: number): Promise<Species>;
    update(id: number, data: Partial<Species>): Promise<Species>;
    delete(id: number): Promise<void>;
    getStats(): Promise<any[]>;
}
