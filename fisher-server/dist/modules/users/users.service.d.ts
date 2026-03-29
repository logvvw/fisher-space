import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(data: Partial<User>): Promise<User>;
    findOne(id: number): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findAll(page?: number, limit?: number): Promise<{
        data: User[];
        total: number;
    }>;
    update(id: number, data: Partial<User>): Promise<User>;
    updateRole(id: number, role: UserRole): Promise<User>;
    updateStatus(id: number, status: UserStatus): Promise<User>;
    delete(id: number): Promise<void>;
}
