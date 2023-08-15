import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User, Video } from '@prisma/client';
import { GetAllFiltersDto } from './dto/get-all-filters.dto';

export type VideoWithRelations = Video & {
  favoritedBy: Partial<User>[];
  likedBy: Partial<User>[];
};

@Injectable()
export class VideosService {
  constructor(private prisma: PrismaService) {}
  create(createVideoDto: CreateVideoDto, authorId: number): Promise<Video> {
    return this.prisma.video.create({
      data: {
        ...createVideoDto,
        authorId,
      },
    });
  }

  findAll(): Promise<Video[]> {
    return this.prisma.video.findMany({ where: { published: true } });
  }

  async findOne(id: number): Promise<Partial<VideoWithRelations> | null> {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: {
        favoritedBy: { select: { id: true, email: true } },
        likedBy: { select: { id: true, email: true } },
      },
    });
    if (!video) {
      throw new NotFoundException(`Video with id: ${id} not found`);
    }
    return video as Partial<VideoWithRelations>;
  }

  async publish(id: number, userId: number): Promise<Video> {
    const video = await this.findOne(id);
    if (video.authorId !== userId) {
      throw new NotFoundException(`Video: ${id} not found.`);
    }
    return this.prisma.video.update({
      where: { id: video.id },
      data: { published: true },
    });
  }

  async unPublish(id: number, userId: number): Promise<Video> {
    const video = await this.findOne(id);
    if (video.authorId !== userId) {
      throw new NotFoundException(`Video: ${id} not found.`);
    }
    return this.prisma.video.update({
      where: { id: video.id },
      data: { published: false },
    });
  }
  async update(
    id: number,
    updateVideoDto: UpdateVideoDto,
    userId: number,
  ): Promise<Video> {
    const video = await this.findOne(id);
    if (video.authorId !== userId) {
      throw new NotFoundException(`Video: ${id} not found.`);
    }
    return this.prisma.video.update({
      where: {
        id: video.id,
      },
      data: updateVideoDto,
    });
  }

  isPublished(video: Partial<Video>): boolean {
    return video.published;
  }

  async like(userId: number, videoId: number): Promise<Video> {
    const videoTryingToLike = await this.findOne(videoId);
    if (videoTryingToLike.likedBy.some((user) => user.id === userId)) {
      throw new ConflictException(
        `User: ${userId} already likes video: ${videoId}`,
      );
    }
    if (!this.isPublished(videoTryingToLike)) {
      throw new ConflictException(
        `The video you're trying to like isn't published`,
      );
    }
    return this.prisma.video.update({
      where: { id: videoTryingToLike.id },
      data: {
        likedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async dislike(userId: number, videoId: number): Promise<Video> {
    const videoTryingToDislike = await this.findOne(videoId);
    if (!videoTryingToDislike.likedBy.some((user) => user.id === userId)) {
      throw new ConflictException(
        `User: ${userId} has not liked video: ${videoId}`,
      );
    }
    if (!this.isPublished(videoTryingToDislike)) {
      throw new ConflictException(
        `The video you're trying to disike isn't published`,
      );
    }
    return this.prisma.video.update({
      where: { id: videoTryingToDislike.id },
      data: {
        likedBy: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  async addToFavorites(userId: number, videoId: number): Promise<Video> {
    const videoTryingToAddToFavorites = await this.findOne(videoId);
    if (
      videoTryingToAddToFavorites.favoritedBy.some((user) => user.id === userId)
    ) {
      throw new ConflictException(
        `User: ${userId} has already added video: ${videoId} to favorites`,
      );
    }
    if (!this.isPublished(videoTryingToAddToFavorites)) {
      throw new ConflictException(
        `The video you're trying to add to favorites isn't published`,
      );
    }
    return this.prisma.video.update({
      where: {
        id: videoTryingToAddToFavorites.id,
      },
      data: {
        favoritedBy: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async removeFromFavorites(userId: number, videoId: number): Promise<Video> {
    const videoTryingToRemoveFromFavorites = await this.findOne(videoId);
    if (
      !videoTryingToRemoveFromFavorites.favoritedBy.some(
        (user) => user.id === userId,
      )
    ) {
      throw new ConflictException(
        `User: ${userId} hasn't added video: ${videoId} to favorites`,
      );
    }
    if (!this.isPublished(videoTryingToRemoveFromFavorites)) {
      throw new ConflictException(
        `The video you're trying to remove from favorites isn't published`,
      );
    }
    return this.prisma.video.update({
      where: {
        id: videoTryingToRemoveFromFavorites.id,
      },
      data: {
        favoritedBy: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }
}
