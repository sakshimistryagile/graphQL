import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, Min, MinLength } from 'class-validator';

@InputType()
export class CreateBookInput {
  @Field()
  @MinLength(3, { message: 'Please add proper title' })
  @IsNotEmpty({ message: 'Title must not be empty' })
  title: string;

  @Field()
  @IsNotEmpty({ message: 'Publication date must not be empty' })
  publicationDate: Date;

  @Field(() => Int)
  @IsInt({ message: 'Author ID must be an integer' })
  @Min(1, { message: 'Author ID must be a positive number' })
  authorId: number;
}
