import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(username: string, password: string): Promise<{
        token: string;
        user: {
            id: number;
            username: string;
            nickname: string;
            role: import("../users/entities/user.entity").UserRole;
            avatar: string;
        };
    }>;
    register(data: any): Promise<import("../users/entities/user.entity").User>;
    getProfile(userId: number): Promise<{
        id: number;
        username: string;
        phone: string;
        email: string;
        role: import("../users/entities/user.entity").UserRole;
        nickname: string;
        avatar: string;
        gender: string;
        province: string;
        city: string;
        district: string;
        status: import("../users/entities/user.entity").UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
