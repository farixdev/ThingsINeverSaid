import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  NotFoundException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ConfessionsService } from './confessions.service';
import { CreateConfessionDto } from './dto/create-confession.dto';

@Controller('confessions')
export class ConfessionsController {
  constructor(private readonly confessionsService: ConfessionsService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    // Clamp limit between 1 and 50
    const safeLimit = Math.min(Math.max(limit, 1), 50);
    const safePage = Math.max(page, 1);
    return this.confessionsService.findPaginated(safePage, safeLimit, search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const confession = await this.confessionsService.findOne(id);
    if (!confession) {
      throw new NotFoundException(`Confession #${id} not found`);
    }
    return confession;
  }

  @Post()
  async create(@Body() dto: CreateConfessionDto) {
    return this.confessionsService.create(dto);
  }
}
