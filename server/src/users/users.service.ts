import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { type UserRole } from '../auth/constants/user-roles'
import { User } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  findByNickname(nickname: string) {
    return this.userModel.findOne({ nickname }).exec()
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec()
  }

  findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      return null
    }

    return this.userModel.findById(id).exec()
  }

  createUser(data: {
    firstName: string
    lastName: string
    nickname: string
    email: string
    role: UserRole
    passwordHash: string
  }) {
    const user = new this.userModel(data)
    return user.save()
  }
}