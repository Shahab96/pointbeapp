import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from '../users/users.service';

import { FollowersResolver } from './followers.resolver';
import { FollowersService } from './followers.service';
import { FollowerEntity } from './models/follower.entity';
import { UserEntity } from 'src/users/models/user.entity';

@Module({
  exports: [FollowersService, FollowersResolver],
  imports: [
	  TypeOrmModule.forFeature([UserEntity]),
	  TypeOrmModule.forFeature([FollowerEntity]),
	],
  providers: [FollowersService, FollowersResolver, UsersService],
})
export class FollowersModule {}
