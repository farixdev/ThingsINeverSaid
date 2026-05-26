import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateConfessionDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsNotEmpty({ message: 'Confession text cannot be empty' })
  text: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  author?: string;
}
