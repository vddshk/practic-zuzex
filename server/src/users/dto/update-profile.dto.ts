import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { USER_ROLES } from '../../auth/constants/user-roles'

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsString()
  @IsIn(USER_ROLES)
  role: (typeof USER_ROLES)[number]

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  workplace?: string
}