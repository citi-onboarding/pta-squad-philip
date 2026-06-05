import { EmprestimoService } from "../../src/services/loan/loanService";
import { CreateLoanDTO } from "../../src/dtos/loan/createLoanDTO";
import { EmprestimoRepository } from "../../src/repositories/loanRepository";
import { NotFoundError } from "../../src/errors/notFoundError";
import { atualizarEmprestimosAtrasados } from "../../src/services/loan/loanHelpers";

jest.mock("../../src/repositories/loanRepository");
jest.mock("../../src/services/loan/loanHelpers");
jest.mock("../../src/services/emailServices", () => ({
  enviarConfirmacaoDevolucao: jest.fn().mockResolvedValue(undefined as any),
  enviarLembrete: jest.fn().mockResolvedValue(undefined as any),
}));

const mockEmprestimoRepository = EmprestimoRepository as jest.Mocked<typeof EmprestimoRepository>;
const mockAtualizarEmprestimosAtrasados = atualizarEmprestimosAtrasados as jest.MockedFunction<typeof atualizarEmprestimosAtrasados>;

describe("EmprestimoService - Loan Management Business Rules", () => {
  let service: EmprestimoService;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  beforeEach(() => {
    service = new EmprestimoService();
    jest.clearAllMocks();
    mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);
  });

  describe("Availability: Loan can only be created if book has available quantity", () => {
    test("should prevent loan creation when book has zero available quantity", async () => {
      mockEmprestimoRepository.findBookById.mockResolvedValue({
        id: "book-1",
        quantidade_disponivel: 0,
        quantidade_total: 5,
      } as any);

      const loanData: CreateLoanDTO = {
        livro_id: "book-1",
        nome_cliente: "João Silva",
        email_cliente: "joao@example.com",
        data_locacao: today.toISOString(),
        data_prevista_devolucao: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await expect(service.create(loanData)).rejects.toThrow(
        "Livro não encontrado no estoque."
      );
    });

    test("should prevent loan creation when book is not found in database", async () => {
      mockEmprestimoRepository.findBookById.mockResolvedValue(null);

      const loanData: CreateLoanDTO = {
        livro_id: "nonexistent-book",
        nome_cliente: "Maria Santos",
        email_cliente: "maria@example.com",
        data_locacao: today.toISOString(),
        data_prevista_devolucao: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await expect(service.create(loanData)).rejects.toThrow(
        "Livro não encontrado no estoque."
      );
    });

    test("should allow loan creation when book has available quantity greater than zero", async () => {
      mockEmprestimoRepository.findBookById.mockResolvedValue({
        id: "book-1",
        titulo: "Clean Code",
        quantidade_disponivel: 5,
        quantidade_total: 10,
      } as any);

      mockEmprestimoRepository.decreaseBookAvailability.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.create.mockResolvedValue({
        id: "loan-1",
        livro_id: "book-1",
        nome_cliente: "Pedro Costa",
        email_cliente: "pedro@example.com",
        status: "Em_andamento",
      } as any);

      const loanData: CreateLoanDTO = {
        livro_id: "book-1",
        nome_cliente: "Pedro Costa",
        email_cliente: "pedro@example.com",
        data_locacao: today.toISOString(),
        data_prevista_devolucao: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const result = await service.create(loanData);

      expect(result).toBeDefined();
      expect(mockEmprestimoRepository.create).toHaveBeenCalled();
    });
  });

  describe("Stock Update: Decrease available quantity on loan creation, increase on return", () => {
    test("should decrease book availability by one unit when loan is created", async () => {
      const bookWithAvailability = {
        id: "book-1",
        titulo: "Design Patterns",
        quantidade_disponivel: 3,
        quantidade_total: 5,
      };

      mockEmprestimoRepository.findBookById.mockResolvedValue(bookWithAvailability as any);
      mockEmprestimoRepository.decreaseBookAvailability.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.create.mockResolvedValue({
        id: "loan-1",
        livro_id: "book-1",
      } as any);

      const loanData: CreateLoanDTO = {
        livro_id: "book-1",
        nome_cliente: "Ana Silva",
        email_cliente: "ana@example.com",
        data_locacao: today.toISOString(),
        data_prevista_devolucao: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await service.create(loanData);

      expect(mockEmprestimoRepository.decreaseBookAvailability).toHaveBeenCalledWith(
        "book-1",
        3
      );
    });

    test("should increase book availability when loan is deleted with Em_andamento status", async () => {
      mockEmprestimoRepository.getById.mockResolvedValue({
        id: "loan-1",
        livro_id: "book-1",
        status: "Em_andamento",
      } as any);

      mockEmprestimoRepository.increaseBookAvailability.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.delete.mockResolvedValue(undefined as any);

      const result = await service.delete("loan-1");

      expect(mockEmprestimoRepository.increaseBookAvailability).toHaveBeenCalledWith("book-1");
      expect(result.message).toContain("deletado com sucesso");
    });

    test("should increase book availability when loan is deleted with Atrasado status", async () => {
      mockEmprestimoRepository.getById.mockResolvedValue({
        id: "loan-1",
        livro_id: "book-2",
        status: "Atrasado",
      } as any);

      mockEmprestimoRepository.increaseBookAvailability.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.delete.mockResolvedValue(undefined as any);

      await service.delete("loan-1");

      expect(mockEmprestimoRepository.increaseBookAvailability).toHaveBeenCalledWith("book-2");
    });

    test("should increase book availability when book is returned", async () => {
      mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.getByIdWithBook.mockResolvedValue({
        id: "loan-1",
        livro_id: "book-1",
        status: "Em_andamento",
        email_cliente: "cliente@example.com",
        nome_cliente: "Cliente",
        livro: { titulo: "Test Book" },
      } as any);

      mockEmprestimoRepository.returnBook.mockResolvedValue({
        id: "loan-1",
        status: "Devolvido",
      } as any);

      await service.returnBook("loan-1");

      expect(mockEmprestimoRepository.returnBook).toHaveBeenCalledWith("loan-1", "book-1");
    });

    test("should not increase availability when deleting a loan with Devolvido status", async () => {
      mockEmprestimoRepository.getById.mockResolvedValue({
        id: "loan-1",
        livro_id: "book-1",
        status: "Devolvido",
      } as any);

      mockEmprestimoRepository.delete.mockResolvedValue(undefined as any);

      await service.delete("loan-1");

      expect(mockEmprestimoRepository.increaseBookAvailability).not.toHaveBeenCalled();
    });
  });

  describe("Date Validation: Return date cannot be before rental date, maximum 45 days", () => {
    test("should prevent loan creation when return date is before rental date", async () => {
      const rentalDate = new Date(today);
      const returnDate = new Date(today);
      returnDate.setDate(returnDate.getDate() - 5);

      const loanData: CreateLoanDTO = {
        livro_id: "book-1",
        nome_cliente: "Cliente Teste",
        email_cliente: "teste@example.com",
        data_locacao: rentalDate.toISOString(),
        data_prevista_devolucao: returnDate.toISOString(),
      };

      await expect(service.create(loanData)).rejects.toThrow(
        "A data de locação não pode ser posterior à data prevista de devolução."
      );
    });

    test("should prevent loan creation when return date exceeds 45 days from rental date", async () => {
      const rentalDate = new Date(today);
      const returnDate = new Date(today);
      returnDate.setDate(returnDate.getDate() + 46);

      mockEmprestimoRepository.findBookById.mockResolvedValue({
        id: "book-1",
        quantidade_disponivel: 1,
      } as any);

      const loanData: CreateLoanDTO = {
        livro_id: "book-1",
        nome_cliente: "Cliente Teste",
        email_cliente: "teste@example.com",
        data_locacao: rentalDate.toISOString(),
        data_prevista_devolucao: returnDate.toISOString(),
      };

      await expect(service.create(loanData)).rejects.toThrow(
        "O prazo máximo de empréstimo é de 45 dias. Para períodos maiores, é necessário renovar o empréstimo."
      );
    });

    test("should allow loan creation with exactly 45 days duration", async () => {
      const rentalDate = new Date(today);
      const returnDate = new Date(today);
      returnDate.setDate(returnDate.getDate() + 45);

      mockEmprestimoRepository.findBookById.mockResolvedValue({
        id: "book-1",
        titulo: "Test Book",
        quantidade_disponivel: 2,
        quantidade_total: 5,
      } as any);

      mockEmprestimoRepository.decreaseBookAvailability.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.create.mockResolvedValue({
        id: "loan-1",
        status: "Em_andamento",
      } as any);

      const loanData: CreateLoanDTO = {
        livro_id: "book-1",
        nome_cliente: "Cliente Teste",
        email_cliente: "teste@example.com",
        data_locacao: rentalDate.toISOString(),
        data_prevista_devolucao: returnDate.toISOString(),
      };

      const result = await service.create(loanData);

      expect(result).toBeDefined();
      expect(mockEmprestimoRepository.create).toHaveBeenCalled();
    });

    test("should allow loan creation with return date equal to rental date", async () => {
      const rentalDate = new Date(today);
      const returnDate = new Date(today);

      mockEmprestimoRepository.findBookById.mockResolvedValue({
        id: "book-1",
        titulo: "Test Book",
        quantidade_disponivel: 1,
        quantidade_total: 5,
      } as any);

      mockEmprestimoRepository.decreaseBookAvailability.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.create.mockResolvedValue({
        id: "loan-1",
        status: "Em_andamento",
      } as any);

      const loanData: CreateLoanDTO = {
        livro_id: "book-1",
        nome_cliente: "Cliente Teste",
        email_cliente: "teste@example.com",
        data_locacao: rentalDate.toISOString(),
        data_prevista_devolucao: returnDate.toISOString(),
      };

      const result = await service.create(loanData);

      expect(result).toBeDefined();
    });
  });

  describe("Required Fields: All fields mandatory except rental date which defaults to today", () => {
    test("should throw error when book_id is missing", async () => {
      const loanData = {
        nome_cliente: "Test Client",
        email_cliente: "test@example.com",
        data_locacao: today.toISOString(),
        data_prevista_devolucao: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      } as any;

      await expect(service.create(loanData)).rejects.toThrow(
        "Todos os campos precisam ser preenchidos."
      );
    });

    test("should throw error when client name is missing", async () => {
      const loanData = {
        livro_id: "book-1",
        email_cliente: "test@example.com",
        data_locacao: today.toISOString(),
        data_prevista_devolucao: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      } as any;

      await expect(service.create(loanData)).rejects.toThrow(
        "Todos os campos precisam ser preenchidos."
      );
    });

    test("should throw error when client email is missing", async () => {
      const loanData = {
        livro_id: "book-1",
        nome_cliente: "Test Client",
        data_locacao: today.toISOString(),
        data_prevista_devolucao: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      } as any;

      await expect(service.create(loanData)).rejects.toThrow(
        "Todos os campos precisam ser preenchidos."
      );
    });

    test("should throw error when return date is missing", async () => {
      const loanData = {
        livro_id: "book-1",
        nome_cliente: "Test Client",
        email_cliente: "test@example.com",
        data_locacao: today.toISOString(),
      } as any;

      await expect(service.create(loanData)).rejects.toThrow(
        "Todos os campos precisam ser preenchidos."
      );
    });

    test("should allow loan creation with all required fields present", async () => {
      mockEmprestimoRepository.findBookById.mockResolvedValue({
        id: "book-1",
        quantidade_disponivel: 1,
      } as any);

      mockEmprestimoRepository.decreaseBookAvailability.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.create.mockResolvedValue({ id: "loan-1" } as any);

      const loanData: CreateLoanDTO = {
        livro_id: "book-1",
        nome_cliente: "Test Client",
        email_cliente: "test@example.com",
        data_locacao: today.toISOString(),
        data_prevista_devolucao: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const result = await service.create(loanData);

      expect(result).toBeDefined();
    });
  });

  describe("Overdue Status: Status changes to Atrasado when current date exceeds return date", () => {
    test("should update loans to Atrasado status when return date is passed", async () => {
      mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);

      await service.getAll();

      expect(mockAtualizarEmprestimosAtrasados).toHaveBeenCalled();
    });

    test("should prevent returning loan that is already returned", async () => {
      mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.getByIdWithBook.mockResolvedValue({
        id: "loan-1",
        status: "Devolvido",
        livro_id: "book-1",
      } as any);

      await expect(service.returnBook("loan-1")).rejects.toThrow(
        "Esse empréstimo não pode ser devolvido."
      );
    });

    test("should allow returning loan with in_progress status", async () => {
      mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.getByIdWithBook.mockResolvedValue({
        id: "loan-1",
        status: "Em_andamento",
        livro_id: "book-1",
        email_cliente: "cliente@example.com",
        nome_cliente: "Cliente",
        livro: { titulo: "Test Book" },
      } as any);

      mockEmprestimoRepository.returnBook.mockResolvedValue({
        id: "loan-1",
        status: "Devolvido",
      } as any);

      const result = await service.returnBook("loan-1");

      expect(result.message).toContain("Livro devolvido com sucesso");
    });

    test("should allow returning loan with overdue status", async () => {
      mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.getByIdWithBook.mockResolvedValue({
        id: "loan-1",
        status: "Atrasado",
        livro_id: "book-1",
        email_cliente: "cliente@example.com",
        nome_cliente: "Cliente",
        livro: { titulo: "Test Book" },
      } as any);

      mockEmprestimoRepository.returnBook.mockResolvedValue({
        id: "loan-1",
        status: "Devolvido",
      } as any);

      const result = await service.returnBook("loan-1");

      expect(result.message).toContain("Livro devolvido com sucesso");
    });
  });

  describe("Overdue Reminders: Can only send reminder for loans with overdue status", () => {
    test("should prevent sending reminder for non-overdue loans", async () => {
      mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.getByIdWithBook.mockResolvedValue({
        id: "loan-1",
        status: "Em_andamento",
        livro_id: "book-1",
        email_cliente: "cliente@example.com",
        nome_cliente: "Cliente",
      } as any);

      await expect(service.sendReminder("loan-1")).rejects.toThrow(
        "Só é possível enviar lembrete para empréstimos atrasados."
      );
    });

    test("should allow sending reminder for overdue loans", async () => {
      mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.getByIdWithBook.mockResolvedValue({
        id: "loan-1",
        status: "Atrasado",
        email_cliente: "cliente@example.com",
        nome_cliente: "Cliente Test",
        data_prevista_devolucao: today,
        livro: { titulo: "Test Book" },
      } as any);

      const result = await service.sendReminder("loan-1");

      expect(result.message).toContain("Lembrete enviado com sucesso");
    });

    test("should throw error when loan does not exist", async () => {
      mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.getByIdWithBook.mockResolvedValue(null);

      await expect(service.sendReminder("nonexistent-loan")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("Query Operations: Updates overdue status before returning data", () => {
    test("should update overdue loans before retrieving all loans", async () => {
      mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.getAll.mockResolvedValue([
        { id: "loan-1", status: "Em_andamento" },
        { id: "loan-2", status: "Atrasado" },
      ] as any);

      await service.getAll();

      expect(mockAtualizarEmprestimosAtrasados).toHaveBeenCalled();
      expect(mockEmprestimoRepository.getAll).toHaveBeenCalled();
    });

    test("should update overdue loans before searching by client name", async () => {
      mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.getByClienteNome.mockResolvedValue([
        { id: "loan-1", nome_cliente: "João" },
      ] as any);

      await service.getByClienteNome("João");

      expect(mockAtualizarEmprestimosAtrasados).toHaveBeenCalled();
      expect(mockEmprestimoRepository.getByClienteNome).toHaveBeenCalledWith("João");
    });
  });

  describe("Email Notifications: Handle failures gracefully without affecting book return", () => {
    test("should return book successfully even if email notification fails", async () => {
      const { enviarConfirmacaoDevolucao } = require("../../src/services/emailServices");
      enviarConfirmacaoDevolucao.mockRejectedValueOnce(new Error("SMTP Connection failed"));

      mockAtualizarEmprestimosAtrasados.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.getByIdWithBook.mockResolvedValue({
        id: "loan-1",
        status: "Em_andamento",
        livro_id: "book-1",
        email_cliente: "cliente@example.com",
        nome_cliente: "Cliente",
        livro: { titulo: "Test Book" },
      } as any);

      mockEmprestimoRepository.returnBook.mockResolvedValue({
        id: "loan-1",
        status: "Devolvido",
      } as any);

      const result = await service.returnBook("loan-1");

      expect(result.message).toContain("Livro devolvido com sucesso");
      expect(mockEmprestimoRepository.returnBook).toHaveBeenCalled();
    });
  });

  describe("Loan Deletion: Handle different loan statuses correctly", () => {
    test("should throw error when deleting non-existent loan", async () => {
      mockEmprestimoRepository.getById.mockResolvedValue(null);

      await expect(service.delete("nonexistent-loan")).rejects.toThrow(
        NotFoundError
      );
    });

    test("should delete loan successfully and restore stock availability", async () => {
      mockEmprestimoRepository.getById.mockResolvedValue({
        id: "loan-1",
        livro_id: "book-1",
        status: "Em_andamento",
      } as any);

      mockEmprestimoRepository.increaseBookAvailability.mockResolvedValue(undefined as any);
      mockEmprestimoRepository.delete.mockResolvedValue(undefined as any);

      const result = await service.delete("loan-1");

      expect(result.message).toContain("deletado com sucesso");
      expect(mockEmprestimoRepository.delete).toHaveBeenCalledWith("loan-1");
    });
  });
});