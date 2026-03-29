import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
export declare class FavoritesService {
    private favoritesRepository;
    constructor(favoritesRepository: Repository<Favorite>);
    create(userId: number, venueId: number): Promise<Favorite>;
    findByUser(userId: number): Promise<Favorite[]>;
    delete(userId: number, venueId: number): Promise<void>;
    isFavorited(userId: number, venueId: number): Promise<boolean>;
}
