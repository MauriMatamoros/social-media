import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUserDto extends UserDto {
  @ApiProperty({
    type: String,
    description: "This is the user's password.",
    example: 'secret123',
  })
  @IsString()
  password: string;
}
