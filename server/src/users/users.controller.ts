import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common'
import type { Request } from 'express'
import { CreatePortfolioProjectDto } from './dto/create-portfolio-project.dto'
import { UpdatePortfolioProjectDto } from './dto/update-portfolio-project.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getUserProfileById(@Param('id') id: string) {
    return this.usersService.getUserProfileById(id)
  }

  @Put(':id')
  updateUserProfile(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateUserProfile(request, id, dto)
  }

  @Post(':id/portfolio')
  addPortfolioProject(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() dto: CreatePortfolioProjectDto,
  ) {
    return this.usersService.addPortfolioProject(request, id, dto)
  }

  @Put(':id/portfolio/:projectId')
  updatePortfolioProject(
    @Req() request: Request,
    @Param('id') id: string,
    @Param('projectId') projectId: string,
    @Body() dto: UpdatePortfolioProjectDto,
  ) {
    return this.usersService.updatePortfolioProject(request, id, projectId, dto)
  }

  @Delete(':id/portfolio/:projectId')
  deletePortfolioProject(
    @Req() request: Request,
    @Param('id') id: string,
    @Param('projectId') projectId: string,
  ) {
    return this.usersService.deletePortfolioProject(request, id, projectId)
  }
}