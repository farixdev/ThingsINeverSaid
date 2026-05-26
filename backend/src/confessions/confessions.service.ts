import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Confession } from './confession.entity';
import { CreateConfessionDto } from './dto/create-confession.dto';

@Injectable()
export class ConfessionsService {
  constructor(
    @InjectRepository(Confession)
    private readonly confessionRepo: Repository<Confession>,
  ) {}

  async findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{
    data: Confession[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const skip = (page - 1) * limit;

    let where: any = {};
    if (search && search.trim()) {
      where = [
        { title: ILike(`%${search.trim()}%`) },
        { text: ILike(`%${search.trim()}%`) },
        { author: ILike(`%${search.trim()}%`) },
      ];
    }

    const [data, total] = await this.confessionRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      hasMore: skip + data.length < total,
    };
  }

  async findOne(id: number): Promise<Confession | null> {
    return this.confessionRepo.findOne({ where: { id } });
  }

  async create(dto: CreateConfessionDto): Promise<Confession> {
    const confession = this.confessionRepo.create({
      title: dto.title || 'Untitled confession',
      text: dto.text,
      author: dto.author || 'Anonymous',
    });
    return this.confessionRepo.save(confession);
  }

  async seed(): Promise<void> {
    // Intentionally disabled: remove dummy confessions.
    // Seed data should only run in dev when explicitly enabled.
    if (process.env.SEED_CONFESSIONS !== 'true') return;

    const count = await this.confessionRepo.count();
    if (count > 0) return; // Already seeded

    // Seed data removed.
    // (Re-enable by setting SEED_CONFESSIONS=true and restoring seedData.)
  }
}
