import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateTeacherDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}