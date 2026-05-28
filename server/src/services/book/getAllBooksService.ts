import Fuse from "fuse.js";
import { Categoria } from "../../../generated/prisma";
import { BookRepository } from "../../repositories/bookRepository";
import { atualizarEmprestimosAtrasados } from "../loan/emprestimo.service"; 

interface GetAllBooksRequest {
  titulo?: string;
  categoria?: string;
}

export class GetAllBooksService {
  async execute({
    titulo,
    categoria,
  }: GetAllBooksRequest) {
    await atualizarEmprestimosAtrasados();

    const termo = titulo ? titulo.trim() : "";

    const livros = await BookRepository.getAll(

      categoria as Categoria | undefined
    );

    if (!termo) {
      return livros;
    }

    // Applies fuzzy search by title and author
    const fuse = new Fuse(livros, {
      keys: ["titulo", "autor"],
      threshold: 0.4,
      ignoreLocation: true,
    });

    return fuse.search(termo).map((result) => result.item);
  }
}