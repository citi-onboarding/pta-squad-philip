import request from "supertest";
import { app } from "../../src/server";
import prisma from "../../src/database";

jest.mock("src/services/emailServices", () => ({
  enviarLembrete: jest.fn().mockResolvedValue(undefined),
  enviarConfirmacaoDevolucao: jest.fn().mockResolvedValue(undefined),
}));

let livroId: string;
let emprestimoId: string;
let emprestimoAtrasadoId: string;

beforeAll(async () => {
  const livro = await prisma.livro.create({
    data: {
      titulo: "Livro Emprestimo Teste",
      autor: "Autor Emprestimo Teste",
      isbn: "9780132350885",
      editora: "Editora Teste",
      ano: 2020,
      quantidade_total: 5,
      quantidade_disponivel: 5,
      categoria: "Tecnologia",
    },
  });
  livroId = livro.id;

  const emprestimo = await prisma.emprestimo.create({
    data: {
      livro_id: livroId,
      nome_cliente: "Cliente Teste",
      email_cliente: "cliente@teste.com",
      data_locacao: new Date(),
      data_prevista_devolucao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "Em_andamento",
    },
  });
  emprestimoId = emprestimo.id;

  const emprestimoAtrasado = await prisma.emprestimo.create({
    data: {
      livro_id: livroId,
      nome_cliente: "Cliente Teste",
      email_cliente: "cliente@teste.com",
      data_locacao: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      data_prevista_devolucao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: "Atrasado",
    },
  });
  emprestimoAtrasadoId = emprestimoAtrasado.id;
});

afterAll(async () => {
  await prisma.emprestimo.deleteMany({
    where: { nome_cliente: "Cliente Teste" },
  });
  await prisma.livro.deleteMany({
    where: { autor: "Autor Emprestimo Teste" },
  });
  await prisma.$disconnect();
});

describe("POST /emprestimos", () => {
  test("valid data returns 201 and decrements stock.", async () => {
    const livroBefore = await prisma.livro.findFirst({
      where: { id: livroId },
    });
    const estoqueAntes = livroBefore!.quantidade_disponivel;

    const response = await request(app)
      .post("/emprestimos")
      .send({
        livro_id: livroId,
        nome_cliente: "Cliente Teste",
        email_cliente: "cliente@teste.com",
        data_locacao: new Date().toISOString(),
        data_prevista_devolucao: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });

    const livroAfter = await prisma.livro.findFirst({ where: { id: livroId } });

    expect(response.status).toBe(201);
    expect(livroAfter!.quantidade_disponivel).toBe(estoqueAntes - 1);
  });

  test("book with zero stock returns 400", async () => {
    const livroSemEstoque = await prisma.livro.create({
      data: {
        titulo: "Livro Sem Estoque",
        autor: "Autor Emprestimo Teste",
        isbn: "9780132350886",
        editora: "Editora Teste",
        ano: 2020,
        quantidade_total: 1,
        quantidade_disponivel: 0,
        categoria: "Tecnologia",
      },
    });

    const response = await request(app)
      .post("/emprestimos")
      .send({
        livro_id: livroSemEstoque.id,
        nome_cliente: "Cliente Teste",
        email_cliente: "cliente@teste.com",
        data_locacao: new Date().toISOString(),
        data_prevista_devolucao: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      });

    expect(response.status).toBe(400);
  });
});

describe("GET /emprestimos", () => {
  test("It returns 200 and calculates the delay dynamically.", async () => {
    const response = await request(app).get("/emprestimos");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    const atrasados = response.body.filter(
      (emp: any) =>
        new Date(emp.data_prevista_devolucao) < new Date() &&
        emp.status !== "Devolvido",
    );
    atrasados.forEach((emp: any) => {
      expect(emp.status).toBe("Atrasado");
    });
  });
});

describe("GET /emprestimos/busca", () => {
  test("returns customer loans by name.", async () => {
    const response = await request(app).get(
      "/emprestimos/busca?nome=Cliente Teste",
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((emp: any) => {
      expect(emp.nome_cliente.toLowerCase()).toContain("cliente teste");
    });
  });
});

describe("PUT /emprestimos/:id/devolver", () => {
  test("returns 200 and increases stock.", async () => {
    const livroBefore = await prisma.livro.findFirst({
      where: { id: livroId },
    });
    const estoqueAntes = livroBefore!.quantidade_disponivel;

    const response = await request(app).put(
      `/emprestimos/${emprestimoId}/devolver`,
    );

    const livroAfter = await prisma.livro.findFirst({ where: { id: livroId } });

    expect(response.status).toBe(200);
    expect(livroAfter!.quantidade_disponivel).toBe(estoqueAntes + 1);
  });
});

describe("POST /emprestimos/:id/lembrete", () => {
  test("overdue loan returns 200", async () => {
    const response = await request(app).post(
      `/emprestimos/${emprestimoAtrasadoId}/lembrete`,
    );

    expect(response.status).toBe(200);
  });

  test("loan not overdue returns 400", async () => {
    const response = await request(app).post(
      `/emprestimos/${emprestimoId}/lembrete`,
    );

    expect(response.status).toBe(400);
  });
});
