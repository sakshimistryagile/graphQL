import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateAuthorInput {
  @Field()
  @MinLength(3, {
    message: 'Please add a proper name with at least 3 characters',
  })
  @IsNotEmpty({ message: 'name must not be empty' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'BirthDate must not be empty' })
  birthDate: Date;
}
