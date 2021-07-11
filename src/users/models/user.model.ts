import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

import { Post } from '../../posts/models/post.model';

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  userName: string;

  // Do not expose this to gql
  hashedPassword: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field((type) => [User], { nullable: true })
  followers?: User[];

  @Field((type) => [User], { nullable: true })
  following?: User[];

  @Field((type) => [Post], { nullable: true })
  posts?: Post[];
}
