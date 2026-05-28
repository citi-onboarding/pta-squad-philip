import { BookRepository } from "../../repositories/bookRepository";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";
import { atualizarEmprestimosAtrasados } from "../loan/emprestimo.service"; 

export class GetByIdBookService {
  async execute(id: string) {
    await atualizarEmprestimosAtrasados();
    
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