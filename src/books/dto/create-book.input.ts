import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateBookInput {
  @Field()
  title: string;

  @Field()
  publicationDate: Date;

  @Field(() => Int)
  authorId: number;
}
