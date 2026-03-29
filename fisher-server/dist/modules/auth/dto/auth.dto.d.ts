export declare class LoginDto {
    username: string;
    password: string;
}
export declare class RegisterDto {
    username: string;
    password: string;
    nickname?: string;
    phone?: string;
}
export declare class UpdateProfileDto {
    nickname?: string;
    phone?: string;
    email?: string;
    avatar?: string;
    gender?: string;
    province?: string;
    city?: string;
    district?: string;
}
