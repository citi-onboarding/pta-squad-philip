import { CreateBookService } from "../../src/services/book/createBookService";
import { ValidationError } from "../../src/errors/validationError";
import { ConflictError } from "../../src/errors/conflictError";
import { Categoria } from "../../generated/prisma";

jest.mock("../../src/repositories/bookRepository");

const { BookRepository } = require("../../src/repositories/bookRepository");

const mockBookRepository = BookRepository as jest.Mocked<typeof BookRepository>;

describe("CreateBookService", () => {
  let service: CreateBookService;

  beforeEach(() => {
    service = new CreateBookService();
    jest.clearAllMocks();
    mockBookRepository.findByIsbn.mockResolvedValue(null);
    mockBookRepository.create.mockResolvedValue({
      id: 1,
      titulo: "Test Book",
      autor: "Test Author",
      isbn: "1234567890",
      editora: "Test Pub",
      ano: 2023,
      quantidade_total: 10,
      quantidade_disponivel: 10,
      categoria: "Tecnologia",
    } as any);
  });

  describe("Required field validation", () => {
    test("should throw an error if title is empty", async () => {
      await expect(
        service.execute({
          titulo: "   ",
          autor: "Author",
          isbn: "1234567890",
          editora: "Publisher",
          ano: 2023,
          quantidade_total: 10,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow(ValidationError);
    });

    test("should throw an error if author is empty", async () => {
      await expect(
        service.execute({
          titulo: "Title",
          autor: "",
          isbn: "1234567890",
          editora: "Publisher",
          ano: 2023,
          quantidade_total: 10,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow(ValidationError);
    });

    test("should throw an error if ISBN is missing", async () => {
      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: undefined,
          editora: "Publisher",
          ano: 2023,
          quantidade_total: 10,
          categoria: "Tecnologia",
        } as any)
      ).rejects.toThrow(ValidationError);
    });

    test("should throw an error if publisher is blank", async () => {
      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "1234567890",
          editora: "   ",
          ano: 2023,
          quantidade_total: 10,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow(ValidationError);
    });

    test("should throw an error if category is missing", async () => {
      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "1234567890",
          editora: "Publisher",
          ano: 2023,
          quantidade_total: 10,
          categoria: undefined,
        } as any)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("ISBN validation", () => {
    test("should throw an error if ISBN contains non-numeric characters", async () => {
      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "123456789X",
          editora: "Publisher",
          ano: 2023,
          quantidade_total: 10,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow("ISBN deve conter apenas números");
    });

    test("should throw an error if ISBN has fewer than 10 digits", async () => {
      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "123456789",
          editora: "Publisher",
          ano: 2023,
          quantidade_total: 10,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow("ISBN deve conter 10 ou 13 dígitos");
    });

    test("should throw an error if ISBN has 11 digits", async () => {
      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "12345678901",
          editora: "Publisher",
          ano: 2023,
          quantidade_total: 10,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow("ISBN deve conter 10 ou 13 dígitos");
    });

    test("should accept a 10-digit ISBN", async () => {
      await service.execute({
        titulo: "Title",
        autor: "Author",
        isbn: "1234567890",
        editora: "Publisher",
        ano: 2023,
        quantidade_total: 10,
        categoria: "Tecnologia",
      });

      expect(mockBookRepository.create).toHaveBeenCalled();
    });

    test("should accept a 13-digit ISBN", async () => {
      await service.execute({
        titulo: "Title",
        autor: "Author",
        isbn: "1234567890123",
        editora: "Publisher",
        ano: 2023,
        quantidade_total: 10,
        categoria: "Tecnologia",
      });

      expect(mockBookRepository.create).toHaveBeenCalled();
    });
  });

  describe("year Validation", () => {
    test("should throw an error if the year is negative", async () => {
      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "1234567890",
          editora: "Publisher",
          ano: -2023,
          quantidade_total: 10,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow(ValidationError);
    });

    test("should throw an error if the year is less than 1000", async () => {
      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "1234567890",
          editora: "Publisher",
          ano: 999,
          quantidade_total: 10,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow(ValidationError);
    });

    test("should throw an error if the year is greater than the current year", async () => {
      const futureYear = new Date().getFullYear() + 1;
      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "1234567890",
          editora: "Publisher",
          ano: futureYear,
          quantidade_total: 10,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow(ValidationError);
    });

    test("should accept a valid year", async () => {
      await service.execute({
        titulo: "Title",
        autor: "Author",
        isbn: "1234567890",
        editora: "Publisher",
        ano: 2023,
        quantidade_total: 10,
        categoria: "Tecnologia",
      });

      expect(mockBookRepository.create).toHaveBeenCalled();
    });
  });

  describe("Quantity validation", () => {
    test("should throw an error if quantity is negative", async () => {
      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "1234567890",
          editora: "Publisher",
          ano: 2023,
          quantidade_total: -5,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow("quantidade total deve ser um número inteiro maior que zero");
    });

    test("should throw an error if quantity is zero", async () => {
      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "1234567890",
          editora: "Publisher",
          ano: 2023,
          quantidade_total: 0,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow("quantidade total deve ser um número inteiro maior que zero");
    });

    test("should accept a valid quantity", async () => {
      await service.execute({
        titulo: "Title",
        autor: "Author",
        isbn: "1234567890",
        editora: "Publisher",
        ano: 2023,
        quantidade_total: 10,
        categoria: "Tecnologia",
      });

      expect(mockBookRepository.create).toHaveBeenCalled();
    });
  });

  describe("Category validation", () => {
    const validCategories: Categoria[] = [
      "Tecnologia",
      "Ciencias",
      "Historia",
      "Romance",
      "Infantil",
    ] as const;

    validCategories.forEach((cat) => {
      test(`should accept a valid category: ${cat}`, async () => {
        await service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "1234567890",
          editora: "Publisher",
          ano: 2023,
          quantidade_total: 10,
          categoria: cat,
        });

        expect(mockBookRepository.create).toHaveBeenCalled();
      });
    });
  });

  describe("Duplicate ISBN validation", () => {
    test("should throw an error if ISBN already exists", async () => {
      mockBookRepository.findByIsbn.mockResolvedValue({
        id: 1,
        isbn: "1234567890",
      } as any);

      await expect(
        service.execute({
          titulo: "Title",
          autor: "Author",
          isbn: "1234567890",
          editora: "Publisher",
          ano: 2023,
          quantidade_total: 10,
          categoria: "Tecnologia",
        })
      ).rejects.toThrow(ConflictError);

      expect(mockBookRepository.findByIsbn).toHaveBeenCalledWith("1234567890");
    });
  });

  describe("Successful creation", () => {
    test("should create a book with all valid data", async () => {
      const result = await service.execute({
        titulo: "Clean Code",
        autor: "Robert Martin",
        isbn: "9780132350884",
        editora: "Prentice Hall",
        ano: 2008,
        quantidade_total: 15,
        categoria: "Tecnologia",
      });

      expect(result).toBeDefined();
      expect(mockBookRepository.findByIsbn).toHaveBeenCalledWith("9780132350884");
      expect(mockBookRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          titulo: "Clean Code",
          autor: "Robert Martin",
          isbn: "9780132350884",
          quantidade_disponivel: 15,
        })
      );
    });

    test("should set quantidade_disponivel equal to quantidade_total", async () => {
      await service.execute({
        titulo: "Title",
        autor: "Author",
        isbn: "1234567890",
        editora: "Publisher",
        ano: 2023,
        quantidade_total: 20,
        categoria: "Tecnologia",
      });

      expect(mockBookRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          quantidade_total: 20,
          quantidade_disponivel: 20,
        })
      );
    });
  });
});