import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    findByUser(body: {
        user: any;
    }): Promise<import("./entities/favorite.entity").Favorite[]>;
    create(body: {
        venueId: number;
        user: any;
    }): Promise<import("./entities/favorite.entity").Favorite>;
    delete(venueId: string, body: {
        user: any;
    }): Promise<void>;
}
