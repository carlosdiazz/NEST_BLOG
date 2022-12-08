import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { PostgresErrorCode } from './../../common/PostgresErrorCodeEnum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    try {
      const hashPassowrd = await bcrypt.hash(data.password, 10);
      const newUser = this.userRepository.create({
        ...data,
        password: hashPassowrd,
      });
      await this.userRepository.save(newUser);
      newUser.password = undefined;
      return newUser;
    } catch (error) {
      if (error?.code == PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(`Este Email ya existe`);
      }
      throw new BadRequestException(
        `${error.message || 'Paso un error al crear el Juego'}'`,
      );
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Este Usuario no existe');
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    //if (!user) {
    //  throw new NotFoundException('Este Correo no existe');
    //}
    return user;
  }

  ////!Falta por implemntar
  //update(id: number, data: UpdateUserDto) {
  //  return ['FALTA POR IMPLEMNETAR'];
  //}
  //
  ////!Falta por implemntar
  //remove(id: number) {
  //  return ['FALTA POR IMPLEMNETAR'];
  //}
}
