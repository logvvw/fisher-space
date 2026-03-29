import { StockingService } from './stocking.service';
import { CreateStockingDto, UpdateStockingDto } from './dto/stocking.dto';
export declare class StockingController {
    private readonly stockingService;
    constructor(stockingService: StockingService);
    findAll(filters: any): Promise<{
        list: import("./entities/stocking.entity").StockingRecord[];
        total: number;
    }>;
    findOne(id: string): Promise<import("./entities/stocking.entity").StockingRecord>;
    create(dto: CreateStockingDto): Promise<import("./entities/stocking.entity").StockingRecord>;
    update(id: string, dto: UpdateStockingDto): Promise<import("./entities/stocking.entity").StockingRecord>;
    delete(id: string): Promise<void>;
}
