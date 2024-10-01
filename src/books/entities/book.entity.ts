import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Author } from 'src/author/entities/author.entity';
@ObjectType()
export class Book {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  publicationDate: Date;

  @Field(() => Author)
  author: Author;
}
