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

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { Roles } from 'src/core/guard/roles.decorator';
import { RolesGuard } from 'src/core/guard/role.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Admin/Superadmin'
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string',  },
        last_name: { type: 'string',  },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        phone: { type: 'string' },
        address: { type: 'string', },
        role: { type: 'string', enum: ['ADMIN', 'TEACHER', 'STUDENT'], example: 'STUDENT' },
        status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Rasm (jpg, jpeg, png, ixtiyoriy)',
        },
      },
      required: ['first_name', 'last_name', 'email', 'password', 'phone'],
    },
  })
  @ApiCreatedResponse({ description: 'Yangi foydalanuvchi yaratildi' })
  @Roles('ADMIN', 'SUPERADMIN')  
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
        fileIsRequired: false,
      }),
    )
    photo?: Express.Multer.File,
  ) {
    return this.usersService.create(createUserDto, photo);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN', 'TEACHER')
  @ApiOperation({
        summary: 'Admin/Superadmin'
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN', 'TEACHER')
  @ApiOperation({
        summary: 'Admin/Superadmin',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
        summary: 'Admin/Superadmin',
  })
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string'},
        email: { type: 'string' },
        phone: { type: 'string' },
        address: { type: 'string'},
        role: { type: 'string', enum: ['ADMIN', 'TEACHER', 'STUDENT']},
        status: { type: 'string', enum: ['active', 'inactive']},
        photo: {
          type: 'string',
          format: 'binary',
          description: 'Yangi rasm (jpg, jpeg, png, ixtiyoriy)',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Foydalanuvchi yangilandi' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })],
        fileIsRequired: false,
      }),
    )
    photo?: Express.Multer.File,
  ) {
    return this.usersService.update(id, updateUserDto, photo);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPERADMIN')
  @ApiOperation({
    summary: 'Admin/Superadmin',

  })
  @ApiForbiddenResponse({ description: 'Ruxsat yoq' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}