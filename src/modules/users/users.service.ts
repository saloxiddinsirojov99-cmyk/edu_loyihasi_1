import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  private async saveFile(file: Express.Multer.File | null): Promise<string | null> {
  if (!file) {
    return null;
  }

  const uploadDir = join(process.cwd(), 'uploads', 'users');
  await fs.mkdir(uploadDir, { recursive: true });

  const fileName = `${randomUUID()}${extname(file.originalname)}`;
  const filePath = join(uploadDir, fileName);

  await fs.writeFile(filePath, file.buffer);

  return `/uploads/users/${fileName}`;
}

  async create(createUserDto: CreateUserDto, photoFile?: Express.Multer.File) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
      },
    });

    if (existing) {
      throw new ConflictException('Email yoki telefon raqami allaqachon mavjud');
    }
    let photoUrl: string | null = null;
    if (photoFile) {
      photoUrl = await this.saveFile(photoFile);
    }

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: createUserDto.password, 
        photo: photoUrl,
        role: createUserDto.role || 'USER',
        status: createUserDto.status || 'active',
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
        photo: true,
        role: true,
        status: true
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
        photo: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, photoFile?: Express.Multer.File) {
    const existing = await this.findOne(id);

    let photoUrl: string | null = existing.photo;

    if (photoFile) {
      photoUrl = await this.saveFile(photoFile);
      if (existing.photo) {
        const oldPath = join(process.cwd(), existing.photo.replace(/^\//, ''));
        await fs.unlink(oldPath).catch(() => {});
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        photo: photoUrl,
      },
    });
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (user.photo) {
      const filePath = join(process.cwd(), user.photo.replace(/^\//, ''));
      await fs.unlink(filePath).catch(() => {});
    }

    return this.prisma.user.delete({ where: { id } });
  }
}