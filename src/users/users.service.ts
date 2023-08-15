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
import * as bcrypt from 'bcrypt';

export type UserWithRelations = User & {
  following: Partial<User>[];
  followedBy: Partial<User>[];
  videos: Partial<Video>[];
  favoriteVideos: Partial<Video>[];
  likes: Partial<Video>[];
};

@Injectable()
export class UsersService {
  private readonly saltRounds = 10;

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const password = await bcrypt.hash(
        createUserDto.password,
        this.saltRounds,
      );
      return await this.prisma.user.create({
        data: { ...createUserDto, password },
      });
    } catch (e) {
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

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email: ${email} does not exist.`);
    }
    return user;
  }

  async findOne(id: number): Promise<Partial<UserWithRelations> | null> {
    const userWithPassword = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        following: { select: { id: true, email: true } },
        followedBy: { select: { id: true, email: true } },
        videos: { select: { id: true, title: true } },
        favoriteVideos: { select: { id: true, title: true } },
        likes: { select: { id: true, title: true } },
      },
    });
    if (!userWithPassword) {
      throw new NotFoundException(`User with id: ${id} not found.`);
    }
    const { password, ...user } = userWithPassword;
    return user as Partial<UserWithRelations>;
  }

  async follow(follower: number, following: number) {
    const userTryingToFollow = await this.findOne(following);
    if (follower === following) {
      throw new ForbiddenException('You cannot follow yourself.');
    }
    if (userTryingToFollow.followedBy.some((user) => user.id === follower)) {
      throw new ConflictException(
        `User: ${follower} is already following user: ${following}`,
      );
    }

    return this.prisma.user.update({
      where: { id: userTryingToFollow.id },
      data: {
        followedBy: {
          connect: {
            id: follower,
          },
        },
      },
    });
  }

  async unfollow(follower: number, unfollowing: number) {
    const userTryingToUnfollow = await this.findOne(unfollowing);
    if (follower === unfollowing) {
      throw new ForbiddenException('You cannot unfollow yourself.');
    }
    if (!userTryingToUnfollow.followedBy.some((user) => user.id === follower)) {
      throw new ConflictException(
        `User: ${follower} is not following user: ${unfollowing}`,
      );
    }
    return this.prisma.user.update({
      where: { id: userTryingToUnfollow.id },
      data: {
        followedBy: {
          disconnect: {
            id: follower,
          },
        },
      },
    });
  }
}
