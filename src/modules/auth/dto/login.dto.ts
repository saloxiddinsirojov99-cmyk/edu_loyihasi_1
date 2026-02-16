import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email formati notogri' })
  @IsNotEmpty({ message: 'Email majburiy' })
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'Parol majburiy' })
  @MinLength(6, { message: 'Parol kamida 6 ta belgidan iborat bolishi kerak' })
  password: string;
}