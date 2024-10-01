import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthorInput } from './dto/create-author.input';
import { UpdateAuthorInput } from './dto/update-author.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Books } from 'src/schemas/books.schema';
import { Repository } from 'typeorm';
import { Author } from 'src/schemas/author.schema';
import { GraphQLError } from 'graphql';
@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Books)
    private booksRepository: Repository<Books>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}
  async create(createAuthorInput: CreateAuthorInput) {
    try {
      const author = this.authorRepository.create(createAuthorInput);
      await this.authorRepository.save(author);
      return author;
    } catch (error) {
      throw notFoundError(error.errors);
    }
  }

  async findAll(page: number = 1, limit: number = 4) {
    try {
      const skip = (page - 1) * limit;

      const [authors, totalCount] = await this.authorRepository
        .createQueryBuilder('author')
        .leftJoinAndSelect('author.books', 'books')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return { authors, totalCount };
    } catch (error) {
      throw notFoundError(error.errors);
    }
  }

  async findOne(id: number) {
    try {
      const author = await this.authorRepository
        .createQueryBuilder('authors')
        .leftJoinAndSelect('authors.books', 'books')
        .where('books.id = :id', { id }) // Explicitly reference the 'books' table's 'id'
        .getOne();

      if (!author) {
        throw notFoundError('author not found');
      }
      return author;
    } catch (error) {
      throw notFoundError(error);
    }
  }

  async update(id: number, updateAuthorInput: UpdateAuthorInput) {
    try {
      const author = await this.authorRepository.findOneById(id);
      if (!author) {
        throw new BadRequestException('Author not found');
      }
      await this.authorRepository
        .createQueryBuilder()
        .update(Author)
        .set(updateAuthorInput)
        .where('id = :id', { id: id })
        .execute();
      const updatedAuthor = await this.authorRepository.findOneById(id);
      if (!updatedAuthor) {
        throw new BadRequestException('Author not found');
      }
      return updatedAuthor;
    } catch (error) {
      throw notFoundError(error.errors);
    }
  }

  async remove(id: number) {
    try {
      const deleteAuthor = await this.authorRepository.findOneById(id);
      if (!deleteAuthor) {
        throw notFoundError('author not found');
      }
      await this.authorRepository
        .createQueryBuilder()
        .delete()
        .from(Author)
        .where('id = :id', { id: id })
        .execute();
      return deleteAuthor;
    } catch (error) {
      throw notFoundError(error.errors);
    }
  }
}
function notFoundError(message: string) {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  });
}
