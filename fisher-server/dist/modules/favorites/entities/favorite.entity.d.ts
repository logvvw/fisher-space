import { User } from '../../users/entities/user.entity';
import { Venue } from '../../venues/entities/venue.entity';
export declare class Favorite {
    id: number;
    userId: number;
    user: User;
    venueId: number;
    venue: Venue;
    createdAt: Date;
}
