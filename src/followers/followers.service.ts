import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { FollowerEntity } from './models/follower.entity';

@Injectable()
export class FollowersService {
    constructor(
        @InjectRepository(FollowerEntity) private followerRepo: Repository<FollowerEntity>,
    ) { }

    public async follow(userId: string, followUser: string): Promise<FollowerEntity> {
        return this.followerRepo.create({
            userId,
            follows: followUser,
        }).save();
    }

    public async unfollow(userId: string, unfollowUser: string): Promise<DeleteResult> {
        return this.followerRepo.delete({ userId, follows: unfollowUser });
    }

    public async getAllFollowers(userId: string): Promise<string[]> {
        const users = await this.followerRepo.find({ follows: userId });

        return users.map((user) => user.userId);
    }

    public async getAllFollowedUsers(userId: string): Promise<string[]> {
        const users =  await this.followerRepo.find({ userId });

        return users.map((user) => user.follows);
    }
}
