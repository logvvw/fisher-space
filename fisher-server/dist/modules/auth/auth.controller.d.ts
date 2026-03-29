import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, UpdateProfileDto } from './dto/auth.dto';
import { Request } from 'express';
interface AuthRequest extends Request {
    user: any;
}
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            username: string;
            nickname: string;
            role: import("../users/entities/user.entity").UserRole;
            avatar: string;
        };
    }>;
    register(dto: RegisterDto): Promise<import("../users/entities/user.entity").User>;
    getProfile(req: AuthRequest): Promise<{
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
    updateProfile(req: AuthRequest, dto: UpdateProfileDto): Promise<import("../users/entities/user.entity").User>;
}
export {};
