import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, UserRole } from './create.user.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsOptional()
  role?: UserRole;

  @IsOptional()
  status?: Status;
}