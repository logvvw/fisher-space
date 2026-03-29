import { Venue } from '../../venues/entities/venue.entity';
export declare enum PricingType {
    PER_WEIGHT = "per_weight",
    PER_DAY = "per_day",
    PER_HOUR = "per_hour",
    MEMBERSHIP = "membership"
}
export declare class Pricing {
    id: number;
    venueId: number;
    venue: Venue;
    type: PricingType;
    price: number;
    unit: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
}
