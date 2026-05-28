import { BookRepository } from "../../repositories/bookRepository";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";
import { atualizarEmprestimosAtrasados } from "../loan/loanHelpers";

export class GetByIdBookService {
  async execute(id: string) {
    await atualizarEmprestimosAtrasados();
    
    if (!id) {
      throw new ValidationError("O ID do livro é obrigatório.");
    }

    const livro = await BookRepository.getById(id);

    if (!livro) {
      throw new NotFoundError("Livro não encontrado.");
    }

    return livro;
  }
}