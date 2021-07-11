import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { FollowersModule } from './followers/followers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
      context: ({ req, connection }) => connection ? { req: connection.context} : { headers: req.headers },
    }),
    TypeOrmModule.forRoot(),
    UsersModule,
    PostsModule,
    AuthModule,
    FollowersModule,
  ],
  providers: [AuthService],
})
export class AppModule {}
