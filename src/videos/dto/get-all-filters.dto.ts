import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetAllFiltersDto {
  @ApiProperty()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  @IsBoolean()
  owned: boolean;
}
