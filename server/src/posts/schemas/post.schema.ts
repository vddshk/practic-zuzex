import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type PostDocument = HydratedDocument<Post>

export const POST_TYPES = ['Контент', 'Событие', 'Вакансия'] as const
export type PostType = (typeof POST_TYPES)[number]

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, maxlength: 100, trim: true })
  title: string

  @Prop({ required: true, maxlength: 20000, trim: true })
  content: string

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId

  @Prop({ required: true, enum: POST_TYPES })
  type: PostType

  @Prop({ required: true, trim: true })
  direction: string

  @Prop({ default: '' })
  previewImage?: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likedBy: Types.ObjectId[]
}

export const PostSchema = SchemaFactory.createForClass(Post)