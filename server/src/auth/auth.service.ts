import { Injectable, UnauthorizedException } from '@nestjs/common'
import type { Request, Response } from 'express'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new UnauthorizedException('Passwords do not match')
    }

    return {
      message: 'Register endpoint works',
      user: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        nickname: dto.nickname,
        email: dto.email,
        role: dto.role,
      },
    }
  }

  login(dto: LoginDto, response: Response) {
    response.cookie('token', 'mock-token', {
      httpOnly: true,
      sameSite: 'lax',
    })

    return {
      message: 'Login endpoint works',
      nickname: dto.nickname,
    }
  }

  me(request: Request) {
    const token = request.cookies?.token

    if (!token) {
      return {
        isAuthenticated: false,
        user: null,
      }
    }

    return {
      isAuthenticated: true,
      user: {
        nickname: 'mock-user',
        role: 'Frontend Developer',
      },
    }
  }

  health() {
    return {
      status: 'ok',
      module: 'auth',
    }
  }
}