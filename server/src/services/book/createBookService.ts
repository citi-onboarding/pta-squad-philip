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
      throw new ValidationError("Todos os campos são obrigatórios.");
    }

    const stringFields = { titulo, autor, editora, categoria };
    for (const [fieldName, fieldValue] of Object.entries(stringFields)) {
      if (typeof fieldValue === "string" && !fieldValue.trim()) {
        throw new ValidationError(`O campo ${fieldName} não pode estar vazio.`);
      }
    }

    const isbnString = String(isbn).trim();

    if (!isbnString) {
      throw new ValidationError("O ISBN não pode estar vazio.");
    }

    if (!/^\d+$/.test(isbnString)) {
      throw new ValidationError("O ISBN deve conter apenas números.");
    }

    if (isbnString.length !== 10 && isbnString.length !== 13) {
      throw new ValidationError("O ISBN deve conter 10 ou 13 dígitos numéricos.");
    }

    const currentYear = new Date().getFullYear();
    if (!Number.isInteger(ano) || ano < 1000 || ano > currentYear) {
      throw new ValidationError(`O ano deve estar entre 1000 e ${currentYear}.`);
    }

    // Validações de quantidade
    if (!Number.isInteger(quantidade_total) || quantidade_total <= 0) {
      throw new ValidationError("A quantidade total deve ser um número inteiro maior que zero.");
    }

    const livroComMesmoIsbn = await BookRepository.findByIsbn(String(isbn));

    if (livroComMesmoIsbn) {
      throw new ConflictError("Já existe um livro com este ISBN.");
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
        throw new ConflictError("Já existe um livro com este ISBN.");
      }

      throw error;
    }
  }
}