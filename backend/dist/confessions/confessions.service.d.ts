import { Repository } from 'typeorm';
import { Confession } from './confession.entity';
import { CreateConfessionDto } from './dto/create-confession.dto';
export declare class ConfessionsService {
    private readonly confessionRepo;
    constructor(confessionRepo: Repository<Confession>);
    findPaginated(page: number, limit: number, search?: string): Promise<{
        data: Confession[];
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    }>;
    findOne(id: number): Promise<Confession | null>;
    create(dto: CreateConfessionDto): Promise<Confession>;
    seed(): Promise<void>;
}
