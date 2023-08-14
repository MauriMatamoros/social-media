import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateVideoDto } from './create-video.dto';

export class UpdateVideoDto extends PartialType(
  OmitType(CreateVideoDto, ['authorId']),
) {}
