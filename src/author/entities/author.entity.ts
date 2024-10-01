import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Book } from 'src/books/entities/book.entity';

@ObjectType()
export class Author {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  birthDate: Date;

  @Field(() => [Book])
  books: Book[];
}
