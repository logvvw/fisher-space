import { UsersService } from './users.service';
import { UserRole, UserStatus } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(page?: string, limit?: string): Promise<{
        data: import("./entities/user.entity").User[];
        total: number;
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, dto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
    updateRole(id: string, role: UserRole): Promise<import("./entities/user.entity").User>;
    updateStatus(id: string, status: UserStatus): Promise<import("./entities/user.entity").User>;
    delete(id: string): Promise<void>;
}
