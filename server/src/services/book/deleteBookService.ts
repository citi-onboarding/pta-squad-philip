import { BookRepository } from "../../repositories/bookRepository";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";
import { ConflictError } from "../../errors/conflictError";

export class DeleteBookService {
  async execute(id: string) {
    if (!id) {
      throw new ValidationError("O ID do livro é obrigatório.");
    }

    const livro = await BookRepository.getById(id);

    if (!livro) {
      throw new NotFoundError("ID inexistente, livro não pode ser encontrado.");
    }

    const emprestimosAtivos =
      await BookRepository.countActiveOrLateLoansByBookId(id);

    if (emprestimosAtivos > 0) {
      throw new ConflictError(
        "Não é possível excluir um livro com empréstimos em andamento ou atrasados."
      );
    }

    await BookRepository.delete(id);
  }
}