import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import type { Request } from 'express'
import { Model, Types } from 'mongoose'
import { UsersService } from '../users/users.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Post } from './schemas/post.schema'

type JwtPayload = {
  sub: string
  nickname: string
  role: string
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private async resolveCurrentUser(request: Request, required = true) {
    const token = request.cookies?.token

    if (!token) {
      if (!required) {
        return null
      }

      throw new UnauthorizedException('Unauthorized')
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token)
      const user = await this.usersService.findById(payload.sub)

      if (!user) {
        if (!required) {
          return null
        }

        throw new UnauthorizedException('Unauthorized')
      }

      return user
    } catch {
      if (!required) {
        return null
      }

      throw new UnauthorizedException('Unauthorized')
    }
  }

  private mapPost(post: any, currentUserId?: string | null) {
    const likedBy = (post.likedBy ?? []).map((id: any) => String(id))

    return {
      id: String(post._id),
      title: post.title,
      content: post.content,
      author: post.author?.nickname ?? 'Unknown',
      type: post.type,
      direction: post.direction,
      likes: likedBy.length,
      isLikedByUser: currentUserId ? likedBy.includes(currentUserId) : false,
      previewImage: post.previewImage || undefined,
    }
  }

  async getPosts(
    filters: { type?: string; direction?: string },
    request: Request,
  ) {
    const currentUser = await this.resolveCurrentUser(request, false)

    const query: Record<string, string> = {}

    if (filters.type) {
      query.type = filters.type
    }

    if (filters.direction) {
      query.direction = filters.direction
    }

    const posts = await this.postModel
      .find(query)
      .populate('author', 'nickname')
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    return posts.map((post) => this.mapPost(post, currentUser?.id ?? null))
  }

  async createPost(request: Request, dto: CreatePostDto) {
    const currentUser = await this.resolveCurrentUser(request)

    if (!currentUser) {
      throw new UnauthorizedException('Unauthorized')
    }

    const createdPost = await this.postModel.create({
      ...dto,
      author: new Types.ObjectId(currentUser.id),
      previewImage: dto.previewImage ?? '',
      likedBy: [],
    })

    const populatedPost = await createdPost.populate('author', 'nickname')

    return this.mapPost(populatedPost.toObject(), currentUser.id)
  }

  async updatePost(postId: string, request: Request, dto: UpdatePostDto) {
    const currentUser = await this.resolveCurrentUser(request)

    if (!currentUser) {
      throw new UnauthorizedException('Unauthorized')
    }

    const post = await this.postModel.findById(postId)

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    if (String(post.author) !== currentUser.id) {
      throw new ForbiddenException('You can edit only your own posts')
    }

    if (dto.title !== undefined) {
      post.title = dto.title
    }

    if (dto.content !== undefined) {
      post.content = dto.content
    }

    if (dto.type !== undefined) {
      post.type = dto.type
    }

    if (dto.direction !== undefined) {
      post.direction = dto.direction
    }

    if (dto.previewImage !== undefined) {
      post.previewImage = dto.previewImage
    }

    await post.save()

    const populatedPost = await post.populate('author', 'nickname')

    return this.mapPost(populatedPost.toObject(), currentUser.id)
  }

  async deletePost(postId: string, request: Request) {
    const currentUser = await this.resolveCurrentUser(request)

    if (!currentUser) {
      throw new UnauthorizedException('Unauthorized')
    }

    const post = await this.postModel.findById(postId)

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    if (String(post.author) !== currentUser.id) {
      throw new ForbiddenException('You can delete only your own posts')
    }

    await this.postModel.deleteOne({ _id: postId })

    return {
      message: 'Post deleted successfully',
    }
  }

  async likePost(postId: string, request: Request) {
    const currentUser = await this.resolveCurrentUser(request)

    if (!currentUser) {
      throw new UnauthorizedException('Unauthorized')
    }

    const post = await this.postModel.findById(postId)

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    const alreadyLiked = post.likedBy.some(
      (userId) => String(userId) === currentUser.id,
    )

    if (!alreadyLiked) {
      post.likedBy.push(new Types.ObjectId(currentUser.id))
      await post.save()
    }

    const populatedPost = await post.populate('author', 'nickname')

    return this.mapPost(populatedPost.toObject(), currentUser.id)
  }

  async unlikePost(postId: string, request: Request) {
    const currentUser = await this.resolveCurrentUser(request)

    if (!currentUser) {
      throw new UnauthorizedException('Unauthorized')
    }

    const post = await this.postModel.findById(postId)

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    post.likedBy = post.likedBy.filter(
      (userId) => String(userId) !== currentUser.id,
    ) as any

    await post.save()

    const populatedPost = await post.populate('author', 'nickname')

    return this.mapPost(populatedPost.toObject(), currentUser.id)
  }
}