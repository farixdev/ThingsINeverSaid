import { ConfessionsService } from './confessions.service';
import { CreateConfessionDto } from './dto/create-confession.dto';
export declare class ConfessionsController {
    private readonly confessionsService;
    constructor(confessionsService: ConfessionsService);
    findAll(page: number, limit: number, search?: string): Promise<{
        data: import("./confession.entity").Confession[];
        total: number;
        page: number;
        limit: number;
        hasMore: boolean;
    }>;
    findOne(id: number): Promise<import("./confession.entity").Confession>;
    create(dto: CreateConfessionDto): Promise<import("./confession.entity").Confession>;
}
