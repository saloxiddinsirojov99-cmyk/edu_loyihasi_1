import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
  const user = await this.prisma.user.findUnique({
    where: { email },
  });

  if (!user) return null;
  const isValid = password === user.password;  

  if (!isValid) return null;

  const { password: _, ...result } = user;
  return result;
}

  async login(user: any) {
    if (!user) {
      throw new UnauthorizedException('Login yoki parol notogri');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        firstName: user.first_name,     
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      },
    };
  }
}