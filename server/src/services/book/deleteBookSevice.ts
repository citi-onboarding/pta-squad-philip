import { BookRepository } from "../../repositories/bookRepository";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";

export class DeleteBookService {
  async execute(id: string) {
    if (!id) {
      throw new ValidationError("ID do livro é obrigatório.");
    }

    const livro = await BookRepository.getById(id);

    if (!livro) {
      throw new NotFoundError("Livro não encontrado.");
    }

    await BookRepository.delete(id);
  }
}