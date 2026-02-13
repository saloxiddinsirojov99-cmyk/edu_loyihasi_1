import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Foydalanuvchi login qilish' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Token va user malumotlari' })
  @ApiResponse({ status: 401, description: 'Email yoki parol xato' })
  @ApiResponse({ status: 400, description: 'Validatsiya xatosi' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    return this.authService.login(user);
  }
}