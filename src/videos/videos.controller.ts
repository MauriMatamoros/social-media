import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestWithUserWithRelations } from '../users/users.controller';
import { GetAllFiltersDto } from './dto/get-all-filters.dto';

@ApiTags('Videos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Video object being returned',
    type: CreateVideoDto,
  })
  @ApiOperation({ summary: 'Video creation' })
  @ApiBadRequestResponse({
    description: 'An array of messages detailing the fields that have errors',
  })
  create(
    @Body() createVideoDto: CreateVideoDto,
    @Req() req: RequestWithUserWithRelations,
  ) {
    return this.videosService.create(createVideoDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Fetches an array of videos' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of videos',
    type: [CreateVideoDto],
  })
  findAll(
    @Query() query: GetAllFiltersDto,
    @Req() req: RequestWithUserWithRelations,
  ) {
    return this.videosService.findAll(query, req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Fetches a video and returns the video with all its relations',
  })
  @ApiNotFoundResponse({
    description: "A message stating that there's no video with the queried id.",
  })
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: "Updates a video's fields",
  })
  @ApiNotFoundResponse({
    description: 'Happens when the provided id does not match a video',
  })
  update(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
    @Req() req: RequestWithUserWithRelations,
  ) {
    return this.videosService.update(+id, updateVideoDto, req.user.id);
  }

  @Patch(':id/publish')
  @ApiOperation({
    summary: "Updates the video's published field to true",
  })
  @ApiNotFoundResponse({
    description: 'Happens when the provided id does not match a video',
  })
  publish(@Param('id') id: string, @Req() req: RequestWithUserWithRelations) {
    return this.videosService.publish(+id, req.user.id);
  }

  @Patch(':id/unpublish')
  @ApiOperation({
    summary: "Updates the video's published field to false",
  })
  @ApiNotFoundResponse({
    description: 'Happens when the provided id does not match a video',
  })
  unPublish(@Param('id') id: string, @Req() req: RequestWithUserWithRelations) {
    return this.videosService.unPublish(+id, req.user.id);
  }

  @Patch(':id/like')
  @ApiOperation({
    summary: 'Like a video',
  })
  @ApiNotFoundResponse({
    description: 'Happens when the provided id does not match a video',
  })
  @ApiConflictResponse({
    description: 'Happens when the user has already liked the video',
  })
  @ApiConflictResponse({
    description: 'Happens when tyring to interact with a unpublished video',
  })
  like(@Param('id') id: string, @Req() req: RequestWithUserWithRelations) {
    return this.videosService.like(req.user.id, +id);
  }

  @Patch(':id/dislike')
  @ApiOperation({
    summary: 'Dislike a video',
  })
  @ApiNotFoundResponse({
    description: 'Happens when the provided id does not match a video',
  })
  @ApiConflictResponse({
    description: 'Happens when the user has not liked the video',
  })
  @ApiConflictResponse({
    description: 'Happens when tyring to interact with a unpublished video',
  })
  dislike(@Param('id') id: string, @Req() req: RequestWithUserWithRelations) {
    return this.videosService.dislike(req.user.id, +id);
  }

  @Patch(':id/favorite')
  @ApiOperation({
    summary: 'Add video to favorites',
  })
  @ApiNotFoundResponse({
    description: 'Happens when the provided id does not match a video',
  })
  @ApiConflictResponse({
    description:
      'Happens when the user has already added the video to favorites',
  })
  @ApiConflictResponse({
    description: 'Happens when tyring to interact with a unpublished video',
  })
  addToFavorites(
    @Param('id') id: string,
    @Req() req: RequestWithUserWithRelations,
  ) {
    return this.videosService.addToFavorites(req.user.id, +id);
  }

  @Patch(':id/unfavorite')
  @ApiOperation({
    summary: 'Remove video from favorites',
  })
  @ApiNotFoundResponse({
    description: 'Happens when the provided id does not match a video',
  })
  @ApiConflictResponse({
    description: 'Happens when the user has not added the video to favorites',
  })
  @ApiConflictResponse({
    description: 'Happens when tyring to interact with a unpublished video',
  })
  removeFromFavorites(
    @Param('id') id: string,
    @Req() req: RequestWithUserWithRelations,
  ) {
    return this.videosService.removeFromFavorites(req.user.id, +id);
  }
}
