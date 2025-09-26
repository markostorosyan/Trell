import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { EmailAlreadyTakenException } from './exception/email-already-taken.exception';
import { UserNotFoundException } from './exception/user-not-found.exception';
import { hashData } from '../../utils';
import { In } from 'typeorm';
import { UserIdIsRequiredException } from './exception/user-id-is-required.exception';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userExist = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (userExist) {
      throw new EmailAlreadyTakenException();
    }

    const hashedPassword = await hashData(createUserDto.password);
    const userEntity = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    await this.userRepository.save(userEntity);

    return userEntity;
  }

  async findByIds(users: string[]): Promise<UserEntity[]> {
    const userEntities = await this.userRepository.find({
      where: {
        id: In(users),
      },
    });

    return userEntities;
  }

  async findByEmails(users: string[]): Promise<UserEntity[]> {
    const userEntities = await this.userRepository.find({
      where: {
        email: In(users),
      },
    });

    return userEntities;
  }

  async findOne(id: string): Promise<UserEntity> {
    if (!id) {
      throw new UserIdIsRequiredException();
    }
    const userEntity = await this.userRepository.findOne({ where: { id } });
    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOne({ where: { email } });

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const userEntity = await this.findOne(id);

    this.userRepository.merge(userEntity, updateUserDto);
    await this.userRepository.save(userEntity);

    return userEntity;
  }

  async remove(id: string): Promise<void> {
    try {
      const userEntity = await this.findOne(id);

      await this.userRepository.remove(userEntity);
    } catch (error) {
      console.log(error);
    }
  }
}
