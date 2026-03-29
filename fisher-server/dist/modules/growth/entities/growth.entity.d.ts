import { Venue } from '../../venues/entities/venue.entity';
export declare class GrowthRecord {
    id: number;
    venueId: number;
    venue: Venue;
    name: string;
    currentWeight: number;
    lastWeight: number;
    recordedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
