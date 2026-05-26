import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Confession } from './confession.entity';
import { ConfessionsService } from './confessions.service';
import { ConfessionsController } from './confessions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Confession])],
  controllers: [ConfessionsController],
  providers: [ConfessionsService],
  exports: [ConfessionsService],
})
export class ConfessionsModule {}
