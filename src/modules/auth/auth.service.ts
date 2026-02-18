import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/database/prisma.service';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
  try {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`User topilmadi: ${email}`);
      return null;
    }

    if (!user.password) {
      console.log(`Userda parol yoq: ${email}`);
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log(`Parol notogri: ${email}`);
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  } catch (error) {
    console.error('validateUser xatosi:', error);
    return null;
  }
}

  async generateToken(user: any): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload);
  }
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException("Login yoki parol noto'g'ri");
    }

    const access_token = await this.generateToken(user);

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