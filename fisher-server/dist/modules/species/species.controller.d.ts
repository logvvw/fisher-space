import { SpeciesService } from './species.service';
import { CreateSpeciesDto, UpdateSpeciesDto } from './dto/species.dto';
export declare class SpeciesController {
    private readonly speciesService;
    constructor(speciesService: SpeciesService);
    findAll(filters: any): Promise<{
        list: import("./entities/species.entity").Species[];
        total: number;
    }>;
    getStats(): Promise<any[]>;
    findByVenue(venueId: string): Promise<import("./entities/species.entity").Species[]>;
    create(dto: CreateSpeciesDto): Promise<import("./entities/species.entity").Species>;
    createForVenue(venueId: string, dto: CreateSpeciesDto): Promise<import("./entities/species.entity").Species>;
    update(id: string, dto: UpdateSpeciesDto): Promise<import("./entities/species.entity").Species>;
    delete(id: string): Promise<void>;
}
