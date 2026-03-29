import { UserRole, UserStatus } from '../entities/user.entity';
export declare class CreateUserDto {
    username: string;
    password: string;
    nickname?: string;
    phone?: string;
    email?: string;
    role?: UserRole;
}
export declare class UpdateUserDto {
    nickname?: string;
    phone?: string;
    email?: string;
    avatar?: string;
    gender?: string;
    province?: string;
    city?: string;
    district?: string;
}
export declare class UpdateRoleDto {
    role: UserRole;
}
export declare class UpdateStatusDto {
    status: UserStatus;
}
