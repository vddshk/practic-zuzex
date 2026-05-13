import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

type JwtPayload = {
  sub: string
  nickname: string
  role: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match')
    }

    const existingByNickname = await this.usersService.findByNickname(dto.nickname)

    if (existingByNickname) {
      throw new ConflictException('Nickname already exists')
    }

    const existingByEmail = await this.usersService.findByEmail(dto.email)

    if (existingByEmail) {
      throw new ConflictException('Email already exists')
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const createdUser = await this.usersService.createUser({
      firstName: dto.firstName,
      lastName: dto.lastName,
      nickname: dto.nickname,
      email: dto.email,
      role: dto.role,
      passwordHash,
    })

    return {
      message: 'User registered successfully',
      user: {
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        nickname: createdUser.nickname,
        email: createdUser.email,
        role: createdUser.role,
      },
    }
  }

  async login(dto: LoginDto, response: Response) {
    const user = await this.usersService.findByNickname(dto.nickname)

    if (!user) {
      throw new UnauthorizedException('Invalid nickname or password')
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid nickname or password')
    }

    const payload: JwtPayload = {
      sub: user.id,
      nickname: user.nickname,
      role: user.role,
    }

    const token = await this.jwtService.signAsync(payload)
    const isProduction = process.env.NODE_ENV === 'production'

    response.cookie('token', token, {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
      },
    }
  }

  logout(response: Response) {
    const isProduction = process.env.NODE_ENV === 'production'

    response.clearCookie('token', {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    })

    return {
      message: 'Logout successful',
    }
  }

  async me(request: Request) {
    const token = request.cookies?.token

    if (!token) {
      return {
        isAuthenticated: false,
        user: null,
      }
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token)
      const user = await this.usersService.findById(payload.sub)

      if (!user) {
        return {
          isAuthenticated: false,
          user: null,
        }
      }

      return {
        isAuthenticated: true,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          nickname: user.nickname,
          email: user.email,
          role: user.role,
        },
      }
    } catch {
      return {
        isAuthenticated: false,
        user: null,
      }
    }
  }

  health() {
    return {
      status: 'ok',
      module: 'auth',
    }
  }
}