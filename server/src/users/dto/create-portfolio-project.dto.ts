import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator'

export class CreatePortfolioProjectDto {
  @IsString()
  @MaxLength(100)
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @IsUrl({}, { each: true })
  links?: string[]

  @IsOptional()
  @IsString()
  previewImage?: string
}