import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { USER_ROLES, type UserRole } from '../../auth/constants/user-roles'

export type UserDocument = HydratedDocument<User>

@Schema({ _id: true })
export class PortfolioProject {
  @Prop({ required: true, trim: true, maxlength: 100 })
  title: string

  @Prop({ default: '', trim: true })
  description?: string

  @Prop({ type: [String], default: [] })
  links: string[]

  @Prop({ default: '' })
  previewImage?: string
}

export const PortfolioProjectSchema =
  SchemaFactory.createForClass(PortfolioProject)

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  firstName: string

  @Prop({ required: true, trim: true })
  lastName: string

  @Prop({ required: true, unique: true, trim: true })
  nickname: string

  @Prop({ required: true, unique: true, trim: true })
  email: string

  @Prop({ required: true, enum: USER_ROLES })
  role: UserRole

  @Prop({ default: '', trim: true })
  description?: string

  @Prop({ default: '', trim: true })
  workplace?: string

  @Prop({
    type: [PortfolioProjectSchema],
    default: [],
  })
  portfolio: PortfolioProject[]

  @Prop({ required: true })
  passwordHash: string
}

export const UserSchema = SchemaFactory.createForClass(User)