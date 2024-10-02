import { Injectable } from '@nestjs/common';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/schemas/author.schema';
import { Books } from 'src/schemas/books.schema';
import { Repository } from 'typeorm';
import { GraphQLError } from 'graphql';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Books)
    private booksRepository: Repository<Books>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}
  async create(createBookInput: CreateBookInput) {
    try {
      const author = await this.authorRepository.findOne({
        where: { id: createBookInput.authorId },
      });
      if (!author) {
        throw notFoundError('author not found');
      }
      console.log(author);
      const book = await this.booksRepository.create({
        title: createBookInput.title,
        publicationDate: createBookInput.publicationDate,
        author: author,
      });
      book.author = author;
      // Initialize books array if undefined
      if (!author.books) {
        author.books = [];
      }
      if (!author.books.some((s) => s.id === book.id)) {
        author.books.push(book);
      }
      await this.booksRepository.save(book);
      await this.authorRepository.save(author);
      return book;
    } catch (error) {
      console.log(error);
      throw notFoundError(error);
    }
  }

  async findAll(page: number = 1, limit: number = 4) {
    try {
      const skip = (page - 1) * limit;

      const [books, totalCount] = await this.booksRepository
        .createQueryBuilder('books')
        .leftJoinAndSelect('books.author', 'author')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return { books, totalCount };
    } catch (error) {
      throw notFoundError(error);
    }
  }

  async findOne(id: number) {
    try {
      const book = await this.booksRepository
        .createQueryBuilder('books')
        .leftJoinAndSelect('books.author', 'author')
        .where('books.id = :id', { id }) // Explicitly reference the 'books' table's 'id'
        .getOne();

      if (!book) {
        throw notFoundError('Book not found');
      }
      return book;
    } catch (error) {
      throw notFoundError(error);
    }
  }

  async update(id: number, updateBookInput: UpdateBookInput) {
    try {
      const book = await this.booksRepository.findOneById(id);
      if (!book) {
        throw notFoundError('Book not found');
      }

      await this.booksRepository
        .createQueryBuilder()
        .update(Books)
        .set(updateBookInput)
        .where('id = :id', { id })
        .execute();

      const updatedBook = await this.booksRepository.findOneById(id);
      if (!updatedBook) {
        throw notFoundError('Book not found after update');
      }

      return updatedBook;
    } catch (error) {
      throw notFoundError('Book not found');
    }
  }

  async remove(id: number) {
    try {
      const deleteBook = await this.booksRepository.findOneById(id);
      if (!deleteBook) {
        throw notFoundError('Book not found');
      }
      await this.booksRepository
        .createQueryBuilder()
        .delete()
        .from(Books)
        .where('id = :id', { id: id })
        .execute();
      return deleteBook;
    } catch (error) {
      throw notFoundError('Book not found');
    }
  }
}
function notFoundError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  });
}
