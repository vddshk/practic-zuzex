import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator'
import { USER_ROLES } from '../constants/user-roles'

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsString()
  @IsNotEmpty()
  nickname: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-zА-Яа-я])(?=.*\d).+$/, {
    message: 'Password must contain letters and numbers',
  })
  password: string

  @IsString()
  @IsNotEmpty()
  confirmPassword: string

  @IsString()
  @IsIn(USER_ROLES)
  role: (typeof USER_ROLES)[number]
}