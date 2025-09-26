import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { User } from '../auth/decorator/user.decorator';
import { YouDoNotHavePermissionException } from '../auth/exception/you-do-not-have-permission.exception';
import { RolesAuth } from '../../common/decorators/roles-auth.decorator';

@Controller('user')
@RolesAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMyAccount(@User('id') userId: string): Promise<UserEntity> {
    return await this.userService.findById(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserEntity> {
    return await this.userService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User('id') userId: string,
  ): Promise<UserEntity> {
    if (id !== userId) {
      throw new YouDoNotHavePermissionException();
    }

    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @User('id') userId: string,
  ): Promise<void> {
    if (id !== userId) {
      throw new YouDoNotHavePermissionException();
    }

    return await this.userService.remove(id);
  }
}
