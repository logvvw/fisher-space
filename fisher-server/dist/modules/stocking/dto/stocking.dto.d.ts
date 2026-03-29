import { StockingStatus } from '../entities/stocking.entity';
export declare class CreateStockingDto {
    venueId: number;
    fish: string;
    amount: number;
    date: string | Date;
    supplier?: string;
    status?: StockingStatus;
}
export declare class UpdateStockingDto {
    fish?: string;
    amount?: number;
    date?: string | Date;
    supplier?: string;
    status?: StockingStatus;
}
