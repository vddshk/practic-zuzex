import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post as HttpPost,
  Put,
  Query,
  Req,
} from '@nestjs/common'
import type { Request } from 'express'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(
    @Query('type') type: string | undefined,
    @Query('direction') direction: string | undefined,
    @Req() request: Request,
  ) {
    return this.postsService.getPosts({ type, direction }, request)
  }

  @HttpPost()
  createPost(@Body() dto: CreatePostDto, @Req() request: Request) {
    return this.postsService.createPost(request, dto)
  }

  @Put(':id')
  updatePost(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Req() request: Request,
  ) {
    return this.postsService.updatePost(id, request, dto)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string, @Req() request: Request) {
    return this.postsService.deletePost(id, request)
  }

  @HttpPost(':id/like')
  likePost(@Param('id') id: string, @Req() request: Request) {
    return this.postsService.likePost(id, request)
  }

  @Delete(':id/like')
  unlikePost(@Param('id') id: string, @Req() request: Request) {
    return this.postsService.unlikePost(id, request)
  }
}