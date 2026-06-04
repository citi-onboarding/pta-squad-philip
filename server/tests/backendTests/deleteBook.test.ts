import { DeleteBookService } from "../../src/services/book/deleteBookService";
import { ValidationError } from "../../src/errors/validationError";
import { NotFoundError } from "../../src/errors/notFoundError";
import { ConflictError } from "../../src/errors/conflictError";

jest.mock("../../src/repositories/bookRepository");

const { BookRepository } = require("../../src/repositories/bookRepository");

const mockBookRepository = BookRepository as jest.Mocked<typeof BookRepository>;

describe("DeleteBookService", () => {
  let service: DeleteBookService;

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
    service = new DeleteBookService();
    jest.clearAllMocks();
    mockBookRepository.getById.mockResolvedValue(mockBook);
    mockBookRepository.countActiveOrLateLoansByBookId.mockResolvedValue(0);
    mockBookRepository.delete.mockResolvedValue(undefined);
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

  describe("Book existence validation", () => {
    test("should throw NotFoundError if book does not exist", async () => {
      mockBookRepository.getById.mockResolvedValue(null);

      await expect(service.execute("non-existent-id")).rejects.toThrow(
        NotFoundError
      );

      expect(mockBookRepository.getById).toHaveBeenCalledWith("non-existent-id");
    });

    test("should call getById with the correct id", async () => {
      await service.execute("1");

      expect(mockBookRepository.getById).toHaveBeenCalledWith("1");
    });
  });

  describe("Active loan validation", () => {
    test("should throw ConflictError if book has active loans", async () => {
      mockBookRepository.countActiveOrLateLoansByBookId.mockResolvedValue(1);

      await expect(service.execute("1")).rejects.toThrow(ConflictError);

      expect(
        mockBookRepository.countActiveOrLateLoansByBookId
      ).toHaveBeenCalledWith("1");
    });

    test("should throw ConflictError if book has multiple active loans", async () => {
      mockBookRepository.countActiveOrLateLoansByBookId.mockResolvedValue(5);

      await expect(service.execute("1")).rejects.toThrow(ConflictError);
    });

    test("should not throw if book has no active or late loans", async () => {
      mockBookRepository.countActiveOrLateLoansByBookId.mockResolvedValue(0);

      await expect(service.execute("1")).resolves.not.toThrow();
    });
  });

  describe("Late loan validation", () => {
    test("should throw ConflictError if book has only late loans", async () => {
        
      mockBookRepository.countActiveOrLateLoansByBookId.mockResolvedValue(1);

      await expect(service.execute("1")).rejects.toThrow(ConflictError);

      expect(
        mockBookRepository.countActiveOrLateLoansByBookId
      ).toHaveBeenCalledWith("1");
    });

    test("should throw ConflictError if book has a mix of active and late loans", async () => {
      mockBookRepository.countActiveOrLateLoansByBookId.mockResolvedValue(3);

      await expect(service.execute("1")).rejects.toThrow(ConflictError);
    });

    test("should not call delete if book has late loans", async () => {
      mockBookRepository.countActiveOrLateLoansByBookId.mockResolvedValue(1);

      await expect(service.execute("1")).rejects.toThrow(ConflictError);

      expect(mockBookRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("Successful deletion", () => {
    test("should delete the book when all data is valid", async () => {
      await service.execute("1");

      expect(mockBookRepository.delete).toHaveBeenCalledWith("1");
    });

    test("should follow the correct operation order: fetch, validate loans, delete", async () => {
      const callOrder: string[] = [];

      mockBookRepository.getById.mockImplementation(async () => {
        callOrder.push("getById");
        return mockBook;
      });

      mockBookRepository.countActiveOrLateLoansByBookId.mockImplementation(
        async () => {
          callOrder.push("countActiveOrLateLoansByBookId");
          return 0;
        }
      );

      mockBookRepository.delete.mockImplementation(async () => {
        callOrder.push("delete");
      });

      await service.execute("1");

      expect(callOrder).toEqual([
        "getById",
        "countActiveOrLateLoansByBookId",
        "delete",
      ]);
    });

    test("should not call delete if book does not exist", async () => {
      mockBookRepository.getById.mockResolvedValue(null);

      await expect(service.execute("non-existent-id")).rejects.toThrow(
        NotFoundError
      );

      expect(mockBookRepository.delete).not.toHaveBeenCalled();
    });

    test("should not call delete if book has active loans", async () => {
      mockBookRepository.countActiveOrLateLoansByBookId.mockResolvedValue(2);

      await expect(service.execute("1")).rejects.toThrow(ConflictError);

      expect(mockBookRepository.delete).not.toHaveBeenCalled();
    });
  });
});