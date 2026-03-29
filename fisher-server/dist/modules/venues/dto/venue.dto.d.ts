export declare enum VenueStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    OFFLINE = "offline"
}
export declare class CreateVenueDto {
    name: string;
    province?: string;
    city?: string;
    district?: string;
    address?: string;
    area?: number;
    facilities?: string[];
    businessHours?: string;
    phone?: string;
    coverImage?: string;
    description?: string;
}
export declare class UpdateVenueDto {
    name?: string;
    province?: string;
    city?: string;
    district?: string;
    address?: string;
    area?: number;
    facilities?: string[];
    businessHours?: string;
    phone?: string;
    coverImage?: string;
    description?: string;
    status?: VenueStatus;
}
