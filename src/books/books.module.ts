import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksResolver } from './books.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from 'src/schemas/author.schema';
import { Books } from 'src/schemas/books.schema';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Books])],
  providers: [BooksResolver, BooksService],
})
export class BooksModule {}
