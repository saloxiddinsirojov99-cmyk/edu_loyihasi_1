import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ModuleStatus } from 'node:vm';
import { Status } from '@prisma/client';

export enum UserRole {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN      = 'ADMIN',
  TEACHER    = 'TEACHER',
  STUDENT    = 'STUDENT',
}

export enum UserStatus {
  active   = 'active',
  inactive = 'inactive',
  blocked  = 'blocked',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsPhoneNumber('UZ')
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsEnum(Status)
  @IsOptional()
  status?:Status;      
}