import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { FollowersService } from './followers.service';
import { Follower } from './models/follower.model';

@Resolver(of => Follower)
export class FollowersResolver {
    private pubSub: PubSub = new PubSub();

    constructor(
        private readonly followersService: FollowersService,
        private readonly usersService: UsersService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Mutation(returns => Follower)
    public async follow(
        @Context('user') user: User,
        @Args('user') followUser: string,
    ): Promise<Follower> {
        const follow = await this.followersService.follow(user.id, followUser);
        this.pubSub.publish('newFollower', this.usersService.getUserById(user.id));
        return follow;
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(returns => String)
    public async unfollow(
        @Context('user') user: User,
        @Args('user') unfollowUser: string,
    ): Promise<String> {
        await this.followersService.unfollow(user.id, unfollowUser);

        const unfollowedUser = await this.usersService.getUserById(unfollowUser);
        return `No longer following ${unfollowedUser.userName}`;
    }

    @Subscription(returns => User, {
        resolve: value => value,
    })
    public notifyOfFollower() {
        return this.pubSub.asyncIterator('newFollower');
    }
}
