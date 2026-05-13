import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common'
import type { Request } from 'express'
import { CreatePortfolioProjectDto } from './dto/create-portfolio-project.dto'
import { UpdatePortfolioProjectDto } from './dto/update-portfolio-project.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMyProfile(@Req() request: Request) {
    return this.usersService.getMyProfile(request)
  }

  @Put('me')
  updateMyProfile(@Req() request: Request, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateMyProfile(request, dto)
  }

  @Post('me/portfolio')
  addPortfolioProject(
    @Req() request: Request,
    @Body() dto: CreatePortfolioProjectDto,
  ) {
    return this.usersService.addPortfolioProject(request, dto)
  }

  @Put('me/portfolio/:projectId')
  updatePortfolioProject(
    @Req() request: Request,
    @Param('projectId') projectId: string,
    @Body() dto: UpdatePortfolioProjectDto,
  ) {
    return this.usersService.updatePortfolioProject(request, projectId, dto)
  }

  @Delete('me/portfolio/:projectId')
  deletePortfolioProject(
    @Req() request: Request,
    @Param('projectId') projectId: string,
  ) {
    return this.usersService.deletePortfolioProject(request, projectId)
  }
}