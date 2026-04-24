import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { USER_ROLES, type UserRole } from '../../auth/constants/user-roles'

export type UserDocument = HydratedDocument<User>

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

  @Prop({ required: true })
  passwordHash: string
}

export const UserSchema = SchemaFactory.createForClass(User)