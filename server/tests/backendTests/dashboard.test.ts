import { GetDashboardService } from "../../src/services/dashboard/dashboardService";
import { DashboardRepository } from "../../src/repositories/dashboardRepository";

jest.mock("../../src/repositories/dashboardRepository");

const mockDashboardRepository = DashboardRepository as jest.Mocked<typeof DashboardRepository>;

describe("GetDashboardService", () => {
  let service: GetDashboardService;

  beforeEach(() => {
    service = new GetDashboardService();
    jest.clearAllMocks();
  });

  describe("Dashboard metrics: total books, active loans and overdue books", () => {
    test("should aggregate and display the total quantity of all books in the library", async () => {
      mockDashboardRepository.countActiveLoans.mockResolvedValue(0);
      mockDashboardRepository.countLateLoans.mockResolvedValue(0);
      mockDashboardRepository.getBooksByCategory.mockResolvedValue([]);
      mockDashboardRepository.getLastLoans.mockResolvedValue([]);
      mockDashboardRepository.getTotalBooks.mockResolvedValue({
        _sum: { quantidade_total: 250 },
      } as any);

      const result = await service.execute();

      expect(result.totalLivros).toBe(250);
    });

    test("should count the number of active loans (in progress + overdue)", async () => {
      mockDashboardRepository.countActiveLoans.mockResolvedValue(15);
      mockDashboardRepository.countLateLoans.mockResolvedValue(0);
      mockDashboardRepository.getBooksByCategory.mockResolvedValue([]);
      mockDashboardRepository.getLastLoans.mockResolvedValue([]);
      mockDashboardRepository.getTotalBooks.mockResolvedValue({
        _sum: { quantidade_total: 100 },
      } as any);

      const result = await service.execute();

      expect(result.emprestimosAtivos).toBe(15);
    });

    test("should identify and count the number of overdue books (livros em atraso)", async () => {
      mockDashboardRepository.countActiveLoans.mockResolvedValue(15);
      mockDashboardRepository.countLateLoans.mockResolvedValue(3);
      mockDashboardRepository.getBooksByCategory.mockResolvedValue([]);
      mockDashboardRepository.getLastLoans.mockResolvedValue([]);
      mockDashboardRepository.getTotalBooks.mockResolvedValue({
        _sum: { quantidade_total: 100 },
      } as any);

      const result = await service.execute();

      expect(result.livrosAtrasados).toBe(3);
    });

    test("should retrieve all three dashboard metrics simultaneously without data loss", async () => {
      mockDashboardRepository.countActiveLoans.mockResolvedValue(20);
      mockDashboardRepository.countLateLoans.mockResolvedValue(5);
      mockDashboardRepository.getBooksByCategory.mockResolvedValue([]);
      mockDashboardRepository.getLastLoans.mockResolvedValue([]);
      mockDashboardRepository.getTotalBooks.mockResolvedValue({
        _sum: { quantidade_total: 300 },
      } as any);

      const result = await service.execute();

      expect(result.totalLivros).toBe(300);
      expect(result.emprestimosAtivos).toBe(20);
      expect(result.livrosAtrasados).toBe(5);
    });
  });

  describe("Books distribution chart by category (Romance, Infantil, Tecnologia, Historia, Ciencias)", () => {
    test("should display aggregated quantity of books for each valid category", async () => {
      mockDashboardRepository.countActiveLoans.mockResolvedValue(0);
      mockDashboardRepository.countLateLoans.mockResolvedValue(0);
      mockDashboardRepository.getBooksByCategory.mockResolvedValue([
        {
          categoria: "Romance",
          _sum: { quantidade_total: 50 },
        },
        {
          categoria: "Infantil",
          _sum: { quantidade_total: 40 },
        },
        {
          categoria: "Tecnologia",
          _sum: { quantidade_total: 80 },
        },
        {
          categoria: "Historia",
          _sum: { quantidade_total: 60 },
        },
        {
          categoria: "Ciencias",
          _sum: { quantidade_total: 70 },
        },
      ]);
      mockDashboardRepository.getLastLoans.mockResolvedValue([]);
      mockDashboardRepository.getTotalBooks.mockResolvedValue({
        _sum: { quantidade_total: 300 },
      } as any);

      const result = await service.execute();

      expect(result.livrosPorCategoria).toHaveLength(5);
      expect(result.livrosPorCategoria).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ categoria: "Romance", quantidade: 50 }),
          expect.objectContaining({ categoria: "Infantil", quantidade: 40 }),
          expect.objectContaining({ categoria: "Tecnologia", quantidade: 80 }),
          expect.objectContaining({ categoria: "Historia", quantidade: 60 }),
          expect.objectContaining({ categoria: "Ciencias", quantidade: 70 }),
        ])
      );
    });

    test("should default to zero quantity when a category has no books registered", async () => {
      mockDashboardRepository.countActiveLoans.mockResolvedValue(0);
      mockDashboardRepository.countLateLoans.mockResolvedValue(0);
      mockDashboardRepository.getBooksByCategory.mockResolvedValue([
        {
          categoria: "Tecnologia",
          _sum: { quantidade_total: 100 },
        },
        {
          categoria: "Romance",
          _sum: { quantidade_total: null },
        },
      ]);
      mockDashboardRepository.getLastLoans.mockResolvedValue([]);
      mockDashboardRepository.getTotalBooks.mockResolvedValue({
        _sum: { quantidade_total: 100 },
      } as any);

      const result = await service.execute();

      expect(result.livrosPorCategoria).toContainEqual({
        categoria: "Romance",
        quantidade: 0,
      });
    });

    test("should structure category distribution data as key-value pairs for chart compatibility", async () => {
      mockDashboardRepository.countActiveLoans.mockResolvedValue(0);
      mockDashboardRepository.countLateLoans.mockResolvedValue(0);
      mockDashboardRepository.getBooksByCategory.mockResolvedValue([
        {
          categoria: "Tecnologia",
          _sum: { quantidade_total: 100 },
        },
        {
          categoria: "Infantil",
          _sum: { quantidade_total: 50 },
        },
      ]);
      mockDashboardRepository.getLastLoans.mockResolvedValue([]);
      mockDashboardRepository.getTotalBooks.mockResolvedValue({
        _sum: { quantidade_total: 150 },
      } as any);

      const result = await service.execute();

      expect(result.livrosPorCategoria).toEqual([
        { categoria: "Tecnologia", quantidade: 100 },
        { categoria: "Infantil", quantidade: 50 },
      ]);
    });
  });

  describe("Business rule: Active loans composition (em andamento + atrasados)", () => {
    test("should enforce that overdue loans are a strict subset of active loans", async () => {
      const emprestimosEmAndamento = 10;
      const livrosAtrasados = 5;

      mockDashboardRepository.countActiveLoans.mockResolvedValue(
        emprestimosEmAndamento
      );
      mockDashboardRepository.countLateLoans.mockResolvedValue(livrosAtrasados);
      mockDashboardRepository.getBooksByCategory.mockResolvedValue([]);
      mockDashboardRepository.getLastLoans.mockResolvedValue([]);
      mockDashboardRepository.getTotalBooks.mockResolvedValue({
        _sum: { quantidade_total: 100 },
      } as any);

      const result = await service.execute();

      expect(result.emprestimosAtivos).toBe(emprestimosEmAndamento);
      expect(result.livrosAtrasados).toBe(livrosAtrasados);
      expect(result.livrosAtrasados).toBeLessThanOrEqual(
        result.emprestimosAtivos
      );
    });

    test("should display zero overdue books when all active loans are within their due date", async () => {
      mockDashboardRepository.countActiveLoans.mockResolvedValue(10);
      mockDashboardRepository.countLateLoans.mockResolvedValue(0);
      mockDashboardRepository.getBooksByCategory.mockResolvedValue([]);
      mockDashboardRepository.getLastLoans.mockResolvedValue([]);
      mockDashboardRepository.getTotalBooks.mockResolvedValue({
        _sum: { quantidade_total: 100 },
      } as any);

      const result = await service.execute();

      expect(result.emprestimosAtivos).toBe(10);
      expect(result.livrosAtrasados).toBe(0);
    });

    test("should return zero for both active and overdue loans in an empty library scenario", async () => {
      mockDashboardRepository.countActiveLoans.mockResolvedValue(0);
      mockDashboardRepository.countLateLoans.mockResolvedValue(0);
      mockDashboardRepository.getBooksByCategory.mockResolvedValue([]);
      mockDashboardRepository.getLastLoans.mockResolvedValue([]);
      mockDashboardRepository.getTotalBooks.mockResolvedValue({
        _sum: { quantidade_total: 100 },
      } as any);

      const result = await service.execute();

      expect(result.emprestimosAtivos).toBe(0);
      expect(result.livrosAtrasados).toBe(0);
    });
  });
});