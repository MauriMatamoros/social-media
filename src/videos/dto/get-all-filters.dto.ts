import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetAllFiltersDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  owned: boolean;
}
