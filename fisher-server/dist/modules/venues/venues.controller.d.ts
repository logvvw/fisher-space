import { VenuesService } from './venues.service';
import { CreateVenueDto, UpdateVenueDto } from './dto/venue.dto';
import { Request } from 'express';
interface AuthRequest extends Request {
    user: any;
}
export declare class VenuesController {
    private readonly venuesService;
    constructor(venuesService: VenuesService);
    findAll(filters: any): Promise<{
        list: import("./entities/venue.entity").Venue[];
        total: number;
    }>;
    findPending(): Promise<import("./entities/venue.entity").Venue[]>;
    findByUser(req: AuthRequest): Promise<import("./entities/venue.entity").Venue[]>;
    findOne(id: string): Promise<import("./entities/venue.entity").Venue>;
    create(dto: CreateVenueDto, req: AuthRequest): Promise<import("./entities/venue.entity").Venue>;
    update(id: string, dto: UpdateVenueDto): Promise<import("./entities/venue.entity").Venue>;
    delete(id: string): Promise<void>;
    approve(id: string): Promise<import("./entities/venue.entity").Venue>;
    reject(id: string): Promise<import("./entities/venue.entity").Venue>;
}
export {};
