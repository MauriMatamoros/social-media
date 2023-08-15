import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: String,
    description: "This is the user's email.",
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: "This is the user's password.",
    example: 'secret123',
  })
  @IsString()
  password: string;
}
