import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userRepository.create(createUserDto);
  }

  async findByIds(users: string[]): Promise<UserEntity[]> {
    const userEntities = await this.userRepository.findByEmails(users);

    return userEntities;
  }

  async findById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<void> {
    return await this.userRepository.remove(id);
  }
}
