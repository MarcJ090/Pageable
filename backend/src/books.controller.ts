import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

interface Book {
  id: number;
  title: string;
  author: string;
  status: 'Available' | 'Checked Out';
}

type UserRole = 'Student' | 'Librarian' | 'Admin';

const VALID_ROLES: UserRole[] = ['Student', 'Librarian', 'Admin'];

let books: Book[] = [
  { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', status: 'Available' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', status: 'Checked Out' },
  { id: 3, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', status: 'Available' },
];

let nextId = 4;

@Controller('api/books')
export class BooksController {
  private readonly logger = new Logger('BooksController');

  private validateRole(role: string | undefined): UserRole {
    if (!role || !VALID_ROLES.includes(role as UserRole)) {
      throw new HttpException(
        `Unauthorized: missing or invalid x-user-role header. Received: "${role ?? 'none'}"`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return role as UserRole;
  }

  @Get()
  getBooks(@Headers('x-user-role') role: string) {
    const userRole = this.validateRole(role);
    this.logger.log(`GET /api/books executed by Role: [${userRole}]`);
    return books;
  }

  @Post()
  addBook(
    @Headers('x-user-role') role: string,
    @Body() body: { title: string; author: string },
  ) {
    const userRole = this.validateRole(role);
    this.logger.log(`POST /api/books executed by Role: [${userRole}]`);

    if (userRole === 'Student') {
      throw new HttpException(
        'Forbidden: Students do not have permission to add books.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!body.title || !body.author) {
      throw new HttpException(
        'Bad Request: title and author are required fields.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newBook: Book = {
      id: nextId++,
      title: body.title,
      author: body.author,
      status: 'Available',
    };

    books.push(newBook);
    this.logger.log(`Book created: "${newBook.title}" (id=${newBook.id}) by [${userRole}]`);
    return newBook;
  }

  @Patch(':id/toggle')
  toggleStatus(
    @Headers('x-user-role') role: string,
    @Param('id') id: string,
  ) {
    const userRole = this.validateRole(role);
    this.logger.log(`PATCH /api/books/${id}/toggle executed by Role: [${userRole}]`);

    if (userRole === 'Student') {
      throw new HttpException(
        'Forbidden: Students cannot modify book availability.',
        HttpStatus.FORBIDDEN,
      );
    }

    const book = books.find((b) => b.id === parseInt(id, 10));
    if (!book) {
      throw new HttpException(`Book with id=${id} not found.`, HttpStatus.NOT_FOUND);
    }

    book.status = book.status === 'Available' ? 'Checked Out' : 'Available';
    this.logger.log(`Book id=${id} status toggled to "${book.status}" by [${userRole}]`);
    return book;
  }

  @Delete(':id')
  deleteBook(
    @Headers('x-user-role') role: string,
    @Param('id') id: string,
  ) {
    const userRole = this.validateRole(role);
    this.logger.log(`DELETE /api/books/${id} executed by Role: [${userRole}]`);

    if (userRole === 'Student') {
      throw new HttpException(
        'Forbidden: Students cannot delete books.',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userRole === 'Librarian') {
      throw new HttpException(
        'Forbidden: Librarians do not have delete/purge permissions.',
        HttpStatus.FORBIDDEN,
      );
    }

    const index = books.findIndex((b) => b.id === parseInt(id, 10));
    if (index === -1) {
      throw new HttpException(`Book with id=${id} not found.`, HttpStatus.NOT_FOUND);
    }

    const deleted = books.splice(index, 1)[0];
    this.logger.log(`Book id=${id} ("${deleted.title}") purged by [${userRole}]`);
    return { message: `Book "${deleted.title}" has been purged from the catalog.`, id: deleted.id };
  }
}