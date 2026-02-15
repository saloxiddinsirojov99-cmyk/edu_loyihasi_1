import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1, description: 'Foydalanuvchi ID si' })
  id: number;

  @ApiProperty({ example: 'superadmin@tashkent.edu', description: 'Email' })
  email: string;

  @ApiProperty({ example: 'Super Admin', description: 'Ism familiya yoki username', required: false })
  name?: string;

  @ApiProperty({ example: 'admin', description: 'Rol (admin, teacher, student va h.k.)', required: false })
  role?: string;
}