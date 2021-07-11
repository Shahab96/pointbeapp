import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowersService } from 'src/followers/followers.service';
import { FollowerEntity } from 'src/followers/models/follower.entity';

import { PostEntity } from '../posts/models/post.entity';
import { PostsService } from '../posts/posts.service';
import { UserEntity } from './models/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([FollowerEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([PostEntity]),
  ],
  providers: [UsersResolver, UsersService, PostsService, FollowersService],
})
export class UsersModule {}
