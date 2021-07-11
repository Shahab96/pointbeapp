import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as jwt from 'jsonwebtoken';

import { UserEntity } from './models/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  public getUserById(id: string) {
    return this.userRepo.findOne({ id });
  }

  public getUserByCreds(
    userName: string,
    hashedPassword: string,
  ): Promise<UserEntity> {
    return this.userRepo.findOne({ userName, hashedPassword });
  }

  public createToken(id: string): string {
    return jwt.sign({ id }, process.env.JWT_SECRET);
  }

  public getUsersByIds(ids: string[]) {
    return this.userRepo.findByIds(ids);
  }

  public async createUser(
    userName: string,
    hashedPassword: string,
    firstName: string,
    lastName: string,
    email: string,
  ): Promise<UserEntity> {
    return this.userRepo
      .create({
        userName,
        hashedPassword,
        firstName,
        lastName,
        email,
      })
      .save();
  }
}
