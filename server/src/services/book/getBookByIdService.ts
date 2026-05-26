import { BookRepository } from "../../repositories/bookRepository";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";

export class GetByIdBookService {
  async execute(id: string) {
    if (!id) {
      throw new ValidationError("The book ID is required.");
    }

    const livro = await BookRepository.getById(id);

    if (!livro) {
      throw new NotFoundError("Book not found.");
    }

    return livro;
  }
}