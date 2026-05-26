import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('confessions')
export class Confession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ length: 100, default: 'Anonymous' })
  author: string;

  @CreateDateColumn()
  createdAt: Date;
}
