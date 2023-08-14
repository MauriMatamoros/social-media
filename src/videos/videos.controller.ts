import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Videos')
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
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetches an array of videos' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of videos',
    type: [CreateVideoDto],
  })
  findAll() {
    return this.videosService.findAll();
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
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(+id, updateVideoDto);
  }

  @Patch(':id/publish')
  @ApiOperation({
    summary: "Updates the video's published field to true",
  })
  @ApiNotFoundResponse({
    description: 'Happens when the provided id does not match a video',
  })
  publish(@Param('id') id: string) {
    return this.videosService.publish(+id);
  }

  @Patch(':id/unpublish')
  @ApiOperation({
    summary: "Updates the video's published field to false",
  })
  @ApiNotFoundResponse({
    description: 'Happens when the provided id does not match a video',
  })
  unPublish(@Param('id') id: string) {
    return this.videosService.unPublish(+id);
  }

  @Patch(':id/like/:userId')
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
  like(@Param('id') id: string, @Param('userId') userId: string) {
    return this.videosService.like(+userId, +id);
  }

  @Patch(':id/dislike/:userId')
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
  dislike(@Param('id') id: string, @Param('userId') userId: string) {
    return this.videosService.dislike(+userId, +id);
  }

  @Patch(':id/favorite/:userId')
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
  addToFavorites(@Param('id') id: string, @Param('userId') userId: string) {
    return this.videosService.addToFavorites(+userId, +id);
  }

  @Patch(':id/unfavorite/:userId')
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
    @Param('userId') userId: string,
  ) {
    return this.videosService.removeFromFavorites(+userId, +id);
  }
}
