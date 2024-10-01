import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorResolver } from './author.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from 'src/schemas/author.schema';
import { Books } from 'src/schemas/books.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Books])],
  providers: [AuthorResolver, AuthorService],
})
export class AuthorModule {}
