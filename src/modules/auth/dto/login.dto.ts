import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'superadmin@tashkent.edu',
    description: 'Foydalanuvchi emailingiz',
  })
  @IsEmail({}, { message: 'Email formati notogri' })
  @IsNotEmpty({ message: 'Email majburiy' })
  email: string;

  @ApiProperty({
    example: 'superadmin2026',
    description: 'Foydalanuvchi paroli',
  })
  @IsString()
  @IsNotEmpty({ message: 'Parol majburiy' })
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' })
  password: string;
}