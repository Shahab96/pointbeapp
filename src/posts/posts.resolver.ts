import { Args, Mutation, Resolver, Query, Context, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Post } from './models/post.model';
import { PostsService } from './posts.service';
import { User } from '../users/models/user.model';
import { PubSub } from 'graphql-subscriptions';

@Resolver((of) => Post)
export class PostsResolver {
    private pubSub: PubSub = new PubSub();

    constructor(private readonly postsService: PostsService) { }

    @UseGuards(JwtAuthGuard)
    @Query((returns) => Post, { name: 'post' })
    public async getMessage(@Args('id') messageId: string): Promise<Post> {
        return await this.postsService.getPost(messageId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation((returns) => Post, { name: 'post' })
    public async postMessage(
        @Context('user') user: User,
        @Args('content') content: string,
    ): Promise<Post> {
        const post = await this.postsService.createPost(user.id, content);
        this.pubSub.publish('postAdded', post);
        return post;
    }

    @UseGuards(JwtAuthGuard)
    @Mutation((returns) => Post)
    public async editPost(
        @Args('id') id: string,
        @Args('content') content: string,
    ): Promise<Post> {
        await this.postsService.editPost(id, content);
        return this.postsService.getPost(id);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation((returns) => String)
    public async deletePost(@Args('id') id: string): Promise<String> {
        await this.postsService.deletePost(id);

        return 'Deleted.';
    }

    @Subscription(returns => Post, {
        resolve: value => value,
        filter: (payload, variables) => payload.userId === variables.user,
    })
    public postAdded(@Args('user') userSubscribedTo?: string) {
        return this.pubSub.asyncIterator('postAdded');
    }
}
