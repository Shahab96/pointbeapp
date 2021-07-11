import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Follower {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  follows: string;
}
