import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { POST_TYPES } from '../schemas/post.schema'

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(20000)
  content: string

  @IsString()
  @IsIn(POST_TYPES)
  type: (typeof POST_TYPES)[number]

  @IsString()
  @IsNotEmpty()
  direction: string

  @IsOptional()
  @IsString()
  previewImage?: string
}