export declare enum SpeciesCategory {
    FRESHWATER = "freshwater",
    SALTWATER = "saltwater"
}
export declare class CreateSpeciesDto {
    venueId: number;
    name: string;
    category?: SpeciesCategory;
    avgWeight?: number;
    quantity?: number;
}
export declare class UpdateSpeciesDto {
    name?: string;
    category?: SpeciesCategory;
    avgWeight?: number;
    quantity?: number;
}
