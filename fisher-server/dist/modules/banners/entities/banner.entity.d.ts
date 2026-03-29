export declare enum BannerPosition {
    HOME_LEISURE = "home_leisure",
    HOME_BUSINESS = "home_business"
}
export declare enum BannerStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class Banner {
    id: number;
    title: string;
    image: string;
    link: string;
    position: BannerPosition;
    sortOrder: number;
    status: BannerStatus;
    createdAt: Date;
}
