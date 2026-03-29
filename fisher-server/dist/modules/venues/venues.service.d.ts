import { Repository } from 'typeorm';
import { Venue, VenueStatus } from './entities/venue.entity';
export declare class VenuesService {
    private venuesRepository;
    constructor(venuesRepository: Repository<Venue>);
    create(data: Partial<Venue>, userId: number): Promise<Venue>;
    findAll(filters?: {
        province?: string;
        city?: string;
        keyword?: string;
        status?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{
        list: Venue[];
        total: number;
    }>;
    findPending(): Promise<Venue[]>;
    findByUser(userId: number): Promise<Venue[]>;
    findOne(id: number): Promise<Venue>;
    update(id: number, data: Partial<Venue>): Promise<Venue>;
    delete(id: number): Promise<void>;
    approve(id: number): Promise<Venue>;
    reject(id: number): Promise<Venue>;
    updateStatus(id: number, status: VenueStatus): Promise<Venue>;
}
