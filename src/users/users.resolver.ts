import { NotFoundException, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Mutation,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { User } from './models/user.model';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from 'src/posts/posts.service';
import { Post } from '../posts/models/post.model';
import { FollowersService } from 'src/followers/followers.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly followersService: FollowersService,
  ) {}

  @Query((returns) => User)
  @UseGuards(new JwtAuthGuard())
  public me(@Context('user') user: User) {
    return this.usersService.getUserById(user.id);
  }

  @Mutation((returns) => String)
  public async login(
    @Args('userName') userName: string,
    @Args('hashedPassword') hashedPassword: string,
  ) {
    let user = this.usersService.getUserByCreds(userName, hashedPassword);

    if (!user) {
      throw new NotFoundException();
    }

    const { id } = await this.usersService.getUserByCreds(
      userName,
      hashedPassword,
    );
    return this.usersService.createToken(id);
  }

  @Mutation((returns) => User, { nullable: true })
  public async register(
    @Args('userName') userName: string,
    @Args('hashedPassword') hashedPassword: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
    @Args('email') email: string,
  ): Promise<User> {
    return await this.usersService.createUser(
      userName,
      hashedPassword,
      firstName,
      lastName,
      email,
    );
  }

  @ResolveField('posts', (returns) => [Post])
  public async posts(@Parent() user: User): Promise<Post[]> {
    const { id } = user;

    return await this.postsService.getPostsForUser(id);
  }

  @ResolveField('followers', (returns) => [User])
  public async followers(@Parent() user: User): Promise<User[]> {
    const followerList = await this.followersService.getAllFollowers(user.id);

    return this.usersService.getUsersByIds(followerList);
  }

  @ResolveField('following', (returns) => [User])
  public async following(@Parent() user: User): Promise<User[]> {
    const usersFollowed = await this.followersService.getAllFollowedUsers(user.id);
    
    return this.usersService.getUsersByIds(usersFollowed);
  }
}
