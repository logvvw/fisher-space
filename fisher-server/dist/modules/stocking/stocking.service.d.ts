import { Repository } from 'typeorm';
import { StockingRecord } from './entities/stocking.entity';
import { CreateStockingDto, UpdateStockingDto } from './dto/stocking.dto';
export declare class StockingService {
    private stockingRepository;
    constructor(stockingRepository: Repository<StockingRecord>);
    create(dto: CreateStockingDto): Promise<StockingRecord>;
    findAll(filters?: {
        page?: number;
        pageSize?: number;
        venueId?: number;
    }): Promise<{
        list: StockingRecord[];
        total: number;
    }>;
    findOne(id: number): Promise<StockingRecord>;
    update(id: number, dto: UpdateStockingDto): Promise<StockingRecord>;
    delete(id: number): Promise<void>;
}
