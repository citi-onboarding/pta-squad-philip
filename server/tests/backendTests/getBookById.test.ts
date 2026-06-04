import { GetByIdBookService } from "../../src/services/book/getBookByIdService";
import { ValidationError } from "../../src/errors/validationError";
import { NotFoundError } from "../../src/errors/notFoundError";
import { atualizarEmprestimosAtrasados } from "../../src/services/loan/loanHelpers";

jest.mock("../../src/repositories/bookRepository");

jest.mock("../../src/services/loan/loanHelpers", () => ({
  atualizarEmprestimosAtrasados: jest.fn(),
}));

const { BookRepository } = require("../../src/repositories/bookRepository");

const mockBookRepository = BookRepository as jest.Mocked<typeof BookRepository>;
const mockAtualizarEmprestimos = atualizarEmprestimosAtrasados as jest.Mock;

describe("GetByIdBookService", () => {
  let service: GetByIdBookService;

  const mockBook = {
    id: "1",
    titulo: "Clean Code",
    autor: "Robert Martin",
    isbn: "9780132350884",
    editora: "Prentice Hall",
    ano: 2008,
    quantidade_total: 15,
    quantidade_disponivel: 15,
    categoria: "Tecnologia",
  };

  beforeEach(() => {
    service = new GetByIdBookService();

    jest.clearAllMocks();

    mockAtualizarEmprestimos.mockResolvedValue(undefined);
    mockBookRepository.getById.mockResolvedValue(mockBook);
  });

  describe("Required field validation", () => {
    test("should throw ValidationError if id is not provided", async () => {
      await expect(service.execute("")).rejects.toThrow(ValidationError);
    });

    test("should throw ValidationError if id is undefined", async () => {
      await expect(service.execute(undefined as any)).rejects.toThrow(
        ValidationError
      );
    });

    test("should throw ValidationError if id is null", async () => {
      await expect(service.execute(null as any)).rejects.toThrow(
        ValidationError
      );
    });
  });

  describe("Loan update execution", () => {
    test("should update overdue loans before searching for the book", async () => {
      await service.execute("1");

      expect(mockAtualizarEmprestimos).toHaveBeenCalled();
    });

    test("should execute loan update before calling repository", async () => {
      const callOrder: string[] = [];

      mockAtualizarEmprestimos.mockImplementation(async () => {
        callOrder.push("atualizarEmprestimosAtrasados");
      });

      mockBookRepository.getById.mockImplementation(async () => {
        callOrder.push("getById");
        return mockBook;
      });

      await service.execute("1");

      expect(callOrder).toEqual([
        "atualizarEmprestimosAtrasados",
        "getById",
      ]);
    });
  });

  describe("Book existence validation", () => {
    test("should throw NotFoundError if book does not exist", async () => {
      mockBookRepository.getById.mockResolvedValue(null);

      await expect(service.execute("999")).rejects.toThrow(NotFoundError);

      expect(mockBookRepository.getById).toHaveBeenCalledWith("999");
    });

    test("should call getById with the correct id", async () => {
      await service.execute("1");

      expect(mockBookRepository.getById).toHaveBeenCalledWith("1");
    });
  });

  describe("Successful search", () => {
    test("should return the book when id exists", async () => {
      const result = await service.execute("1");

      expect(result).toEqual(mockBook);
    });

    test("should return the exact repository response", async () => {
      const customBook = {
        ...mockBook,
        titulo: "Domain-Driven Design",
      };

      mockBookRepository.getById.mockResolvedValue(customBook);

      const result = await service.execute("1");

      expect(result).toEqual(customBook);
    });
  });
});