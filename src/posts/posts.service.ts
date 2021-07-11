import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';

import { PostEntity } from './models/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>,
  ) {}

  public async getPostsForUser(id: string): Promise<PostEntity[]> {
    return this.postRepo.find({ userId: id });
  }

  public async createPost(
    userId: string,
    content: string,
  ): Promise<PostEntity> {
    return this.postRepo.create({ userId, content }).save();
  }

  public async getPost(messageId: string): Promise<PostEntity> {
    return this.postRepo.findOne({ id: messageId });
  }

  public async editPost(id: string, content: string): Promise<UpdateResult> {
    return this.postRepo.update(id, { content });
  }

  public async deletePost(id: string): Promise<DeleteResult> {
    return this.postRepo.delete({ id });
  }
}
