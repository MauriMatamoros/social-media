import { Controller, Get, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { UsersService, UserWithRelations } from './users.service';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

export type RequestWithUserWithRelations = Request & {
  user: UserWithRelations;
};

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @ApiOperation({ summary: 'Fetches an array of users' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of users',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Fetches a user and returns the user with all its relations',
  })
  @ApiNotFoundResponse({
    description: "A message stating that there's no user with the queried id.",
  })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id/follow')
  @ApiOperation({
    summary: 'Follower user beings following the target user',
  })
  @ApiNotFoundResponse({
    description: "A message stating that there's no user with the queried id.",
  })
  @ApiForbiddenResponse({
    description: 'Happens when the user tries to follow itself',
  })
  @ApiConflictResponse({
    description: 'Happens when the user is already following the target user',
  })
  follow(@Param('id') id: string, @Req() req: RequestWithUserWithRelations) {
    return this.usersService.follow(req.user.id, +id);
  }

  @Patch(':id/unfollow')
  @ApiOperation({
    summary: 'Follower user unfollows the target user',
  })
  @ApiNotFoundResponse({
    description: "A message stating that there's no user with the queried id.",
  })
  @ApiForbiddenResponse({
    description: 'Happens when the user tries to unfollow itself',
  })
  @ApiConflictResponse({
    description: "Happens when the user isn't following the target user",
  })
  unfollow(
    @Param('unfollowing') unfollowing: string,
    @Req() req: RequestWithUserWithRelations,
  ) {
    return this.usersService.unfollow(req.user.id, +unfollowing);
  }
}
