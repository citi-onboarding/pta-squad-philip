import { GetAllBooksService } from "../../src/services/book/getAllBooksService";
import { Categoria } from "../../generated/prisma";

jest.mock("../../src/repositories/bookRepository");
jest.mock("../../src/services/loan/loanHelpers", () => ({
  atualizarEmprestimosAtrasados: jest.fn().mockResolvedValue(undefined),
}));

const { BookRepository } = require("../../src/repositories/bookRepository");

const mockBookRepository = BookRepository as jest.Mocked<typeof BookRepository>;

const mockBooks = [
  {
    id: 1,
    titulo: "Clean Code",
    autor: "Robert Martin",
    isbn: "9780132350884",
    editora: "Prentice Hall",
    ano: 2008,
    quantidade_total: 10,
    quantidade_disponivel: 8,
    categoria: "Tecnologia" as Categoria,
  },
  {
    id: 2,
    titulo: "O Senhor dos Anéis",
    autor: "J.R.R. Tolkien",
    isbn: "9788533613379",
    editora: "Martins Fontes",
    ano: 1954,
    quantidade_total: 5,
    quantidade_disponivel: 3,
    categoria: "Romance" as Categoria,
  },
  {
    id: 3,
    titulo: "Sapiens",
    autor: "Yuval Noah Harari",
    isbn: "9780062316097",
    editora: "Harper Collins",
    ano: 2011,
    quantidade_total: 7,
    quantidade_disponivel: 7,
    categoria: "Historia" as Categoria,
  },
  {
    id: 4,
    titulo: "The Pragmatic Programmer",
    autor: "Andrew Hunt",
    isbn: "9780201616224",
    editora: "Addison-Wesley",
    ano: 1999,
    quantidade_total: 4,
    quantidade_disponivel: 4,
    categoria: "Tecnologia" as Categoria,
  },
  {
    id: 5,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    isbn: "9788535910663",
    editora: "Companhia das Letras",
    ano: 1899,
    quantidade_total: 6,
    quantidade_disponivel: 6,
    categoria: "Romance" as Categoria,
  },
];

describe("GetAllBooksService", () => {
  let service: GetAllBooksService;

  beforeEach(() => {
    service = new GetAllBooksService();
    jest.clearAllMocks();
    mockBookRepository.getAll.mockResolvedValue(mockBooks);
  });

  describe("Listing without filters", () => {
    test("should return all books when no filters are provided", async () => {
      const result = await service.execute({});

      expect(result).toEqual(mockBooks);
      expect(mockBookRepository.getAll).toHaveBeenCalledWith(undefined);
    });

    test("should return all books when title is an empty string", async () => {
      const result = await service.execute({ titulo: "" });

      expect(result).toEqual(mockBooks);
      expect(mockBookRepository.getAll).toHaveBeenCalledWith(undefined);
    });

    test("should return all books when title contains only whitespace", async () => {
      const result = await service.execute({ titulo: "   " });

      expect(result).toEqual(mockBooks);
      expect(mockBookRepository.getAll).toHaveBeenCalledWith(undefined);
    });
  });

  describe("Category filter", () => {
    test("should pass the category to the repository", async () => {
      mockBookRepository.getAll.mockResolvedValue(
        mockBooks.filter((b) => b.categoria === "Tecnologia")
      );

      await service.execute({ categoria: "Tecnologia" });

      expect(mockBookRepository.getAll).toHaveBeenCalledWith("Tecnologia");
    });

    test("should return only books from the Romance category", async () => {
      const romanceBooks = mockBooks.filter((b) => b.categoria === "Romance");
      mockBookRepository.getAll.mockResolvedValue(romanceBooks);

      const result = await service.execute({ categoria: "Romance" });

      expect(result).toEqual(romanceBooks);
      expect(result.every((b) => b.categoria === "Romance")).toBe(true);
    });

    test("should return an empty list when there are no books in the category", async () => {
      mockBookRepository.getAll.mockResolvedValue([]);

      const result = await service.execute({ categoria: "Infantil" });

      expect(result).toEqual([]);
      expect(mockBookRepository.getAll).toHaveBeenCalledWith("Infantil");
    });
  });

  describe("Title search", () => {
    test("should return the book with exact title match", async () => {
      const result = await service.execute({ titulo: "Clean Code" });

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].titulo).toBe("Clean Code");
    });

    test("should return the book with partial title match", async () => {
      const result = await service.execute({ titulo: "Clean" });

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((b) => b.titulo === "Clean Code")).toBe(true);
    });

    test("should return the book even with title misspelling (fuzzy search)", async () => {
      const result = await service.execute({ titulo: "Clen Code" });

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((b) => b.titulo === "Clean Code")).toBe(true);
    });

    test("should return the book with accent-less search", async () => {
      const result = await service.execute({ titulo: "Senhor dos Aneis" });

      expect(result.length).toBeGreaterThan(0);
    });

    test("should return an empty list when title is too different", async () => {
      const result = await service.execute({ titulo: "xyzxyzxyz" });

      expect(result).toEqual([]);
    });
  });

  describe("Author search", () => {
    test("should find a book by exact author name", async () => {
      const result = await service.execute({ titulo: "Robert Martin" });

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((b) => b.autor === "Robert Martin")).toBe(true);
    });

    test("should find a book with partial author name", async () => {
      const result = await service.execute({ titulo: "Tolkien" });

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((b) => b.autor === "J.R.R. Tolkien")).toBe(true);
    });

    test("should find a book with author name misspelling (fuzzy search)", async () => {
      const result = await service.execute({ titulo: "Machado Asiss" });

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((b) => b.autor === "Machado de Assis")).toBe(true);
    });
  });

  describe("Combined filter: title/author + category", () => {
    test("should search by title within a filtered category", async () => {
      const techBooks = mockBooks.filter((b) => b.categoria === "Tecnologia");
      mockBookRepository.getAll.mockResolvedValue(techBooks);

      const result = await service.execute({
        titulo: "Clean",
        categoria: "Tecnologia",
      });

      expect(result.every((b) => b.categoria === "Tecnologia")).toBe(true);
      expect(result.some((b) => b.titulo === "Clean Code")).toBe(true);
    });

    test("should return an empty list when the term does not match any book in the category", async () => {
      const romanceBooks = mockBooks.filter((b) => b.categoria === "Romance");
      mockBookRepository.getAll.mockResolvedValue(romanceBooks);

      const result = await service.execute({
        titulo: "Clean Code",
        categoria: "Romance",
      });

      expect(result).toEqual([]);
    });

    test("should search by author within a filtered category", async () => {
      const historyBooks = mockBooks.filter((b) => b.categoria === "Historia");
      mockBookRepository.getAll.mockResolvedValue(historyBooks);

      const result = await service.execute({
        titulo: "Harari",
        categoria: "Historia",
      });

      expect(result.length).toBeGreaterThan(0);
      expect(result.some((b) => b.autor === "Yuval Noah Harari")).toBe(true);
    });
  });

  describe("Loan update side effect", () => {
    test("should call atualizarEmprestimosAtrasados before fetching books", async () => {
      const { atualizarEmprestimosAtrasados } = require("../../src/services/loan/loanHelpers");

      await service.execute({});

      expect(atualizarEmprestimosAtrasados).toHaveBeenCalledTimes(1);
    });
  });
});