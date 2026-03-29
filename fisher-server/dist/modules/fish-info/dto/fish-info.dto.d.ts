export declare class CreateFishInfoDto {
    venueId: number;
    content: string;
    images?: string[];
    biteRate?: string;
    rules?: string;
}
export declare class UpdateFishInfoDto {
    content?: string;
    images?: string[];
    biteRate?: string;
    rules?: string;
    isTop?: boolean;
}
