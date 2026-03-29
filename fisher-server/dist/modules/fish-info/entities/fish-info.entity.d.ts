import { Venue } from '../../venues/entities/venue.entity';
import { User } from '../../users/entities/user.entity';
export declare class FishInfo {
    id: number;
    venueId: number;
    venue: Venue;
    userId: number;
    user: User;
    content: string;
    images: string[];
    biteRate: string;
    rules: string;
    isTop: boolean;
    createdAt: Date;
    updatedAt: Date;
}
