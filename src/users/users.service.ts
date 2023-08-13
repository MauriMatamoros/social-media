import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Video } from '@prisma/client';

export type UserWithRelations = User & {
  following: Partial<User>[];
  followedBy: Partial<User>[];
  videos: Partial<Video>[];
  favoriteVideos: Partial<Video>[];
  likes: Partial<Video>;
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (e) {
      console.log(e.message);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(
            `Email: ${createUserDto.email} already in use.`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<UserWithRelations | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        following: { select: { id: true, email: true } },
        followedBy: { select: { id: true, email: true } },
        videos: { select: { id: true, title: true } },
        favoriteVideos: { select: { id: true, title: true } },
        likes: { select: { id: true } },
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found.`);
    }
    return user as UserWithRelations;
  }

  async follow(follower: string, following: string) {
    const userTryingToFollow = await this.findOne(parseInt(following));
    if (follower === following) {
      throw new ForbiddenException('You cannot follow yourself.');
    }
    if (
      userTryingToFollow.followedBy.some(
        (user) => user.id === parseInt(follower),
      )
    ) {
      throw new ConflictException(
        `User: ${follower} is already following user: ${following}`,
      );
    }

    return this.prisma.user.update({
      where: { id: userTryingToFollow.id },
      data: {
        followedBy: {
          connect: {
            id: parseInt(follower),
          },
        },
      },
    });
  }

  async unfollow(follower: string, unfollowing: string) {
    const userTryingToUnfollow = await this.findOne(parseInt(unfollowing));
    if (
      !userTryingToUnfollow.followedBy.some(
        (user) => user.id === parseInt(follower),
      )
    ) {
      throw new ConflictException(
        `User: ${follower} is not following user: ${unfollowing}`,
      );
    }
    return this.prisma.user.update({
      where: { id: userTryingToUnfollow.id },
      data: {
        followedBy: {
          disconnect: {
            id: parseInt(follower),
          },
        },
      },
    });
  }
}
