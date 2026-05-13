import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import type { Request } from 'express'
import { Model } from 'mongoose'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { CreatePortfolioProjectDto } from './dto/create-portfolio-project.dto'
import { UpdatePortfolioProjectDto } from './dto/update-portfolio-project.dto'
import { User } from './schemas/user.schema'

type JwtPayload = {
  sub: string
  nickname: string
  role: string
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  findByNickname(nickname: string) {
    return this.userModel.findOne({ nickname }).exec()
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec()
  }

  findById(id: string) {
    return this.userModel.findById(id).exec()
  }

  createUser(data: {
    firstName: string
    lastName: string
    nickname: string
    email: string
    role: User['role']
    passwordHash: string
  }) {
    const user = new this.userModel({
      ...data,
      description: '',
      workplace: '',
      portfolio: [],
    })

    return user.save()
  }

  private async resolveCurrentUser(request: Request) {
    const token = request.cookies?.token

    if (!token) {
      throw new UnauthorizedException('Unauthorized')
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token)
      const user = await this.userModel.findById(payload.sub)

      if (!user) {
        throw new UnauthorizedException('Unauthorized')
      }

      return user
    } catch {
      throw new UnauthorizedException('Unauthorized')
    }
  }

  private mapUserProfile(user: any) {
    return {
      userId: String(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      nickname: user.nickname,
      role: user.role,
      email: user.email,
      description: user.description ?? '',
      workplace: user.workplace ?? '',
      portfolio: (user.portfolio ?? []).map((project: any) => ({
        id: String(project._id),
        title: project.title,
        description: project.description ?? '',
        links: project.links ?? [],
        previewImage: project.previewImage || undefined,
      })),
    }
  }

  async getMyProfile(request: Request) {
    const user = await this.resolveCurrentUser(request)
    return this.mapUserProfile(user)
  }

  async updateMyProfile(request: Request, dto: UpdateProfileDto) {
    const user = await this.resolveCurrentUser(request)

    if (dto.nickname !== user.nickname) {
      const existingUser = await this.userModel.findOne({ nickname: dto.nickname })

      if (existingUser && String(existingUser._id) !== String(user._id)) {
        throw new ConflictException('Nickname already exists')
      }
    }

    user.firstName = dto.firstName
    user.lastName = dto.lastName
    user.nickname = dto.nickname
    user.role = dto.role
    user.description = dto.description ?? ''
    user.workplace = dto.workplace ?? ''

    await user.save()

    return this.mapUserProfile(user)
  }

  async addPortfolioProject(
    request: Request,
    dto: CreatePortfolioProjectDto,
  ) {
    const user = await this.resolveCurrentUser(request)

    user.portfolio.unshift({
      title: dto.title,
      description: dto.description ?? '',
      links: dto.links ?? [],
      previewImage: dto.previewImage ?? '',
    } as any)

    await user.save()

    return this.mapUserProfile(user)
  }

  async updatePortfolioProject(
    request: Request,
    projectId: string,
    dto: UpdatePortfolioProjectDto,
  ) {
    const user = await this.resolveCurrentUser(request)

    const project = user.portfolio.find(
      (item: any) => String(item._id) === projectId,
    ) as any

    if (!project) {
      throw new NotFoundException('Project not found')
    }

    if (dto.title !== undefined) {
      project.title = dto.title
    }

    if (dto.description !== undefined) {
      project.description = dto.description
    }

    if (dto.links !== undefined) {
      project.links = dto.links
    }

    if (dto.previewImage !== undefined) {
      project.previewImage = dto.previewImage
    }

    await user.save()

    return this.mapUserProfile(user)
  }

  async deletePortfolioProject(request: Request, projectId: string) {
    const user = await this.resolveCurrentUser(request)

    const exists = user.portfolio.some(
      (item: any) => String(item._id) === projectId,
    )

    if (!exists) {
      throw new NotFoundException('Project not found')
    }

    user.portfolio = user.portfolio.filter(
      (item: any) => String(item._id) !== projectId,
    ) as any

    await user.save()

    return this.mapUserProfile(user)
  }
}