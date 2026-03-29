import { Venue } from '../../venues/entities/venue.entity';
export declare enum StockingStatus {
    PENDING = "pending",
    TRANSIT = "transit",
    DONE = "done"
}
export declare class StockingRecord {
    id: number;
    venueId: number;
    venue: Venue;
    fish: string;
    amount: number;
    date: Date;
    supplier: string;
    status: StockingStatus;
    createdAt: Date;
    updatedAt: Date;
}
