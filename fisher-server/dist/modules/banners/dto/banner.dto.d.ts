import { BannerPosition, BannerStatus } from '../entities/banner.entity';
export declare class CreateBannerDto {
    title?: string;
    image: string;
    link?: string;
    position?: BannerPosition;
    sortOrder?: number;
    status?: BannerStatus;
}
export declare class UpdateBannerDto {
    title?: string;
    image?: string;
    link?: string;
    position?: BannerPosition;
    sortOrder?: number;
    status?: BannerStatus;
}
