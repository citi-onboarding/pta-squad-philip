// src/services/CreateBookService.ts

import { BookRepository } from "../../repositories/bookRepository";
import { CreateBookDTO } from "../../dtos/book/createBookDTO";
import { ValidationError } from "../../errors/validationError";
import { ConflictError } from "../../errors/conflictError";

export class CreateBookService {
  async execute(data: CreateBookDTO) {
    const {
      titulo,
      autor,
      isbn,
      editora,
      ano,
      quantidade_total,
      categoria,
    } = data;

    const requiredFields = [
      titulo,
      autor,
      isbn,
      editora,
      ano,
      quantidade_total,
      categoria,
    ];

    if (requiredFields.some((field) => field === undefined)) {
      throw new ValidationError("All fields are required.");
    }

    const isbnDigitsLength = String(isbn).replace(/\D/g, "").length;

    if (isbnDigitsLength !== 10 && isbnDigitsLength !== 13) {
      throw new ValidationError("The ISBN must contain 10 or 13 numeric digits.");
    }

    try {
      const livro = await BookRepository.create({
        titulo: String(titulo),
        autor: String(autor),
        isbn: String(isbn),
        editora: String(editora),
        ano,
        quantidade_total,
        quantidade_disponivel: quantidade_total,
        categoria,
      });

      return livro;
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError("A book with this ISBN already exists.");
      }

      throw error;
    }
  }
}