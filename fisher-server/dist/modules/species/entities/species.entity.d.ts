import { Venue } from '../../venues/entities/venue.entity';
export declare enum SpeciesCategory {
    FRESHWATER = "freshwater",
    SALTWATER = "saltwater"
}
export declare class Species {
    id: number;
    venueId: number;
    venue: Venue;
    name: string;
    category: SpeciesCategory;
    avgWeight: number;
    quantity: number;
    createdAt: Date;
}
