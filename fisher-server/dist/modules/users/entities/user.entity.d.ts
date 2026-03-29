export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    VENUE_ADMIN = "venue_admin",
    ANGLER = "angler"
}
export declare enum UserStatus {
    ACTIVE = "active",
    BANNED = "banned"
}
export declare class User {
    id: number;
    username: string;
    phone: string;
    email: string;
    password: string;
    role: UserRole;
    nickname: string;
    avatar: string;
    gender: string;
    province: string;
    city: string;
    district: string;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
}
