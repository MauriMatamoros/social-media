import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'User object being returned',
    type: UserDto,
  })
  @ApiOperation({ summary: 'User creation' })
  @ApiBadRequestResponse({
    description: 'An array of messages detailing the fields that have errors',
  })
  @ApiConflictResponse({
    description:
      'Happens when trying to create a user with a duplicated unique field such as email.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Fetches an array of users' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of users',
    type: [UserDto],
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

  @Patch(':follower/follow/:following')
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
  follow(
    @Param('follower') follower: string,
    @Param('following') following: string,
  ) {
    return this.usersService.follow(follower, following);
  }

  @Patch(':follower/unfollow/:unfollowing')
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
    @Param('follower') follower: string,
    @Param('unfollowing') unfollowing: string,
  ) {
    return this.usersService.unfollow(follower, unfollowing);
  }
}
