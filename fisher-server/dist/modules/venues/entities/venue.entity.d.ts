import { User } from '../../users/entities/user.entity';
export declare enum VenueStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    OFFLINE = "offline"
}
export declare class Venue {
    id: number;
    userId: number;
    user: User;
    name: string;
    province: string;
    city: string;
    district: string;
    address: string;
    area: number;
    facilities: string[];
    businessHours: string;
    phone: string;
    coverImage: string;
    description: string;
    status: VenueStatus;
    createdAt: Date;
    updatedAt: Date;
}
