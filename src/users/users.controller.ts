import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch(':follower/follow/:following')
  follow(
    @Param('follower') follower: string,
    @Param('following') following: string,
  ) {
    return this.usersService.follow(follower, following);
  }

  @Patch(':follower/unfollow/:unfollowing')
  unfollow(
    @Param('follower') follower: string,
    @Param('unfollowing') unfollowing: string,
  ) {
    return this.usersService.unfollow(follower, unfollowing);
  }
}
