import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Express } from 'express';

import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Roles } from 'src/core/guard/roles.decorator';
import { RolesGuard } from 'src/core/guard/role.guard';

@ApiBearerAuth()
@ApiTags('teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @ApiOperation({
    summary: 'Superadmin/Admin',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string'},
        last_name: { type: 'string' },
        email: { type: 'string', format: 'email'},
        password: { type: 'string'},
        phone: { type: 'string'},
        address: { type: 'string' },
        status: { type: 'string', enum: ['active', 'inactive'] },
        photo: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['first_name', 'last_name', 'email', 'password', 'phone'],
    },
  })
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  async create(
    @Body() dto: CreateTeacherDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
        fileIsRequired: false,
      }),
    )
    photo?: Express.Multer.File,
  ) {
    return this.teachersService.create(dto, photo);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN', 'TEACHER')
  @ApiOperation({
    summary: 'Superadmin/Admin',
  })

  findAll() {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN', 'TEACHER')
  @ApiOperation({
    summary: 'Superadmin/Admin',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Superadmin/Admin',
  })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string'},
        email: { type: 'string'},
        phone: { type: 'string' },
        address: { type: 'string'},
        status: { type: 'string'},
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Yangi rasm (jpg, jpeg, png, ixtiyoriy)',
        },
      },
    },
  })
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({
    summary: 'Superadmin/Admin',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeacherDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
        fileIsRequired: false,
      }),
    )
    photo?: Express.Multer.File,
  ) {
    return this.teachersService.update(id, dto, photo);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({
    summary: 'Superadmin/Admin',
  })
  @ApiForbiddenResponse({ description: 'Ruxsat yoq' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teachersService.remove(id);
  }
}