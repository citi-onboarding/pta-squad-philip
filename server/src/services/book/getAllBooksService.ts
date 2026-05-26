import Fuse from "fuse.js";
import { Categoria } from "../../../generated/prisma";
import { BookRepository } from "../../repositories/bookRepository";

interface GetAllBooksDTO {
  titulo?: string;
  categoria?: Categoria;
}

export class GetAllBooksService {
  async execute({ titulo, categoria }: GetAllBooksDTO) {
    const termo = titulo ? String(titulo).trim() : "";

    const livros = await BookRepository.getAll(categoria);

    if (!termo) {
      return livros;
    }

    const fuse = new Fuse(livros, {
      keys: ["titulo", "autor"],
      threshold: 0.4,
      ignoreLocation: true,
    });

    return fuse.search(termo).map((result) => result.item);
  }
}