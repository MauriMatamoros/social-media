import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}
export class UserDto {
  @ApiProperty({
    type: String,
    description: "This is the user's name",
    example: 'John',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: "This is the user's email. It should be unique.",
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: `This is the user's role. It should be one of the following roles: ${Role.STUDENT} or ${Role.TEACHER}`,
    example: Role.STUDENT,
  })
  @IsEnum(Role)
  @IsOptional()
  role: string;

  @ApiProperty({
    type: String,
    description: "This is the user's photo url.",
    example: 'https://robohash.org/stefan-two',
  })
  @IsUrl()
  @IsOptional()
  photo: string;
}
