import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags,  ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';  

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth('access-token')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Muvaffaqiyatli login', 
    type: UserDto
  })
  @ApiResponse({ status: 401, description: 'Notogri email yoki parol' })
  async login(@Body() body: { email: string; password: string }) {
  return this.authService.login(body.email, body.password);
}
}