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
  @IsString()
  @IsNotEmpty({ message: 'Parol majburiy' })
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bolishi kerak' })
  password: string;
}