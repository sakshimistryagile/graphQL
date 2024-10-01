import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Books } from './books.schema';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true }) // Optional field
  birthDate: Date;

  @OneToMany(() => Books, (book) => book.author)
  books: Books[];
}
