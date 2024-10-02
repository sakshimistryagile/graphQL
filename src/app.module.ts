import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/author.module';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './schemas/author.schema';
import { Books } from './schemas/books.schema';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    AuthorModule,
    BooksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: 5432,
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USERNAME,
      entities: [Author, Books],
      database: process.env.DATABASE_NAME,
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      sortSchema: true,
      playground: true,
      typePaths: ['./**/*.graphql'],
      debug: true,
      subscriptions: {
        'graphql-ws': true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
