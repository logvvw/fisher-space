export declare class CreateGrowthDto {
    venueId: number;
    name: string;
    currentWeight: number;
    lastWeight?: number;
    recordedAt: string | Date;
}
export declare class UpdateGrowthDto {
    name?: string;
    currentWeight?: number;
    lastWeight?: number;
    recordedAt?: string | Date;
}
