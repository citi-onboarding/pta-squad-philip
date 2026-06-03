import request from "supertest";
import { app } from "../../src/server";
import prisma from "../../src/database";

beforeAll(async () => {
  const livro1 = await prisma.livro.create({
    data: {
      titulo: "Livro Dashboard 1",
      autor: "Autor Dashboard Teste",
      isbn: "9780132350887",
      editora: "Editora Teste",
      ano: 2020,
      quantidade_total: 3,
      quantidade_disponivel: 3,
      categoria: "Tecnologia",
    },
  });

  const livro2 = await prisma.livro.create({
    data: {
      titulo: "Livro Dashboard 2",
      autor: "Autor Dashboard Teste",
      isbn: "9780132350888",
      editora: "Editora Teste",
      ano: 2021,
      quantidade_total: 2,
      quantidade_disponivel: 2,
      categoria: "Ciencias",
    },
  });

  await prisma.emprestimo.createMany({
    data: [
      {
        livro_id: livro1.id,
        nome_cliente: "Cliente Dashboard Teste",
        email_cliente: "dashboard@teste.com",
        data_locacao: new Date(),
        data_prevista_devolucao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "Em_andamento",
      },
      {
        livro_id: livro2.id,
        nome_cliente: "Cliente Dashboard Teste",
        email_cliente: "dashboard@teste.com",
        data_locacao: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        data_prevista_devolucao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: "Atrasado",
      },
    ],
  });
});

afterAll(async () => {
  await prisma.emprestimo.deleteMany({
    where: { nome_cliente: "Cliente Dashboard Teste" },
  });
  await prisma.livro.deleteMany({
    where: { autor: "Autor Dashboard Teste" },
  });
  await prisma.$disconnect();
});

describe("GET /dashboard", () => {
  test("retorna 200", async () => {
    const response = await request(app).get("/dashboard");

    expect(response.status).toBe(200);
  });

  test("retorna totalLivros como número", async () => {
    const response = await request(app).get("/dashboard");

    expect(typeof response.body.totalLivros).toBe("number");
  });

  test("retorna emprestimosAtivos contando apenas Em_andamento", async () => {
    const emAndamento = await prisma.emprestimo.count({
      where: { status: "Em_andamento" },
    });

    const response = await request(app).get("/dashboard");

    expect(response.body.emprestimosAtivos).toBe(emAndamento);
  });

  test("retorna livrosAtrasados contando apenas Atrasado", async () => {
    const atrasados = await prisma.emprestimo.count({
      where: { status: "Atrasado" },
    });

    const response = await request(app).get("/dashboard");

    expect(response.body.livrosAtrasados).toBe(atrasados);
  });

  test("retorna livrosPorCategoria como array", async () => {
    const response = await request(app).get("/dashboard");

    expect(response.body.livrosPorCategoria).toBeInstanceOf(Array);
  });

  test("retorna ultimosEmprestimos com no máximo 5 registros", async () => {
    const response = await request(app).get("/dashboard");

    expect(response.body.ultimosEmprestimos).toBeInstanceOf(Array);
    expect(response.body.ultimosEmprestimos.length).toBeLessThanOrEqual(5);
  });
});
