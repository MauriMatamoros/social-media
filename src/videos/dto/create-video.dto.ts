import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({
    type: String,
    description: "This is the video's title",
    example: 'Funny Video',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    description: "This is the video's src url",
    example: 'https://youtu.be/-LFSpfxBcm4',
  })
  @IsUrl()
  @IsNotEmpty()
  src: string;
}
