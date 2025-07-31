import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    name: 'page',
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    const num = parseInt(value, 10);
    return isNaN(num) || num < 1 ? 1 : num;
  })
  page?: number;

  @ApiProperty({
    name: 'limit',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) => {
    const num = parseInt(value, 10);
    return isNaN(num) || num < 1 ? 1 : num;
  })
  limit?: number;
}
