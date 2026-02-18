import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { join } from 'path';
import * as fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaService) {}

  private async saveFile(file: Express.Multer.File | null): Promise<string | null> {
    if (!file) return null;

    const uploadDir = join(process.cwd(), 'uploads', 'teachers');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${randomUUID()}${extname(file.originalname)}`;
    const filePath = join(uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    return `/modules/teachers/${fileName}`;
  }

  async create(dto: CreateTeacherDto, photo?: Express.Multer.File) {
    const existing = await this.prisma.teacher.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (existing) {
      throw new ConflictException('Email yoki telefon raqami allaqachon mavjud');
    }

    let photoUrl: string | null = null;
    if (photo) {
      photoUrl = await this.saveFile(photo);
    }

    return this.prisma.teacher.create({
      data: {
        ...dto,
        password: dto.password,
        photo: photoUrl,
        status: dto.status || 'active',
      },
    });
  }

  async findAll() {
    return this.prisma.teacher.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
        photo: true,
        status: true,
        created_at: true,
        update_at: true,
        groups: true, 
      },
    });
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        address: true,
        photo: true,
        status: true,
        created_at: true,
        update_at: true,
        groups: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Oqituvchi topilmadi');
    }

    return teacher;
  }

  async update(id: number, dto: UpdateTeacherDto, photo?: Express.Multer.File) {
    const existing = await this.findOne(id);

    let photoUrl: string | null = existing.photo;

    if (photo) {
      photoUrl = await this.saveFile(photo);
      if (existing.photo) {
        const oldPath = join(process.cwd(), existing.photo.replace(/^\//, ''));
      }
    }

    return this.prisma.teacher.update({
      where: { id },
      data: {
        ...dto,
        photo: photoUrl,
      },
    });
  }

  async remove(id: number) {
    const teacher = await this.findOne(id);

    if (teacher.photo) {
      const filePath = join(process.cwd(), teacher.photo.replace(/^\//, ''));
      await fs.unlink(filePath).catch(() => {});
    }

    return this.prisma.teacher.delete({ where: { id } });
  }
}