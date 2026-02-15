import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';  

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Muvaffaqiyatli login', 
    type: UserDto
  })
  @ApiResponse({ status: 401, description: 'Notogri email yoki parol' })
  async login(@Body() loginDto: LoginDto): Promise<UserDto> {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    const { access_token } = await this.authService.login(user); 

    return {
      id: user.id,
      email: user.email,
      name: user.name || user.email.split('@')[0], 
      role: user.role,
    };
  }
}