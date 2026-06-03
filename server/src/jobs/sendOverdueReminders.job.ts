import cron from "node-cron";
import prisma from "@database";
import { enviarLembrete } from "../services/emailServices";
import { atualizarEmprestimosAtrasados } from "../services/loan/loanHelpers";

// Creates a full-day interval to compare DateTime fields by calendar day.
function criarIntervaloDoDia(data: Date) {
  const inicio = new Date(data);
  inicio.setHours(0, 0, 0, 0);

  const fim = new Date(data);
  fim.setHours(23, 59, 59, 999);

  return { inicio, fim };
}

// Adds a delay between emails to avoid SMTP provider rate limits.
function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function enviarLembretePreventivo() {
  const hoje = new Date();

  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);

  const intervaloAmanha = criarIntervaloDoDia(amanha);

  // Preventive reminders are sent once, one day before the expected return date.
  const emprestimos = await prisma.emprestimo.findMany({
    where: {
      status: "Em_andamento",
      data_devolucao_real: null,
      data_lembrete_preventivo_enviado: null,
      data_prevista_devolucao: {
        gte: intervaloAmanha.inicio,
        lte: intervaloAmanha.fim,
      },
    },
    include: {
      livro: true,
    },
  });

  for (const emprestimo of emprestimos) {
    try {
      await enviarLembrete({
        emailCliente: emprestimo.email_cliente,
        nomeCliente: emprestimo.nome_cliente,
        tituloLivro: emprestimo.livro.titulo,
        dataPrevista: emprestimo.data_prevista_devolucao,
      });

      await prisma.emprestimo.update({
        where: {
          id: emprestimo.id,
        },
        data: {
          data_lembrete_preventivo_enviado: new Date(),
        },
      });

      await esperar(30000);
    } catch (error) {
      console.error(
        `Erro ao enviar lembrete preventivo para ${emprestimo.email_cliente}:`,
        error,
      );
    }
  }
}

async function enviarLembreteDeAtraso() {
  const hoje = new Date();
  const intervaloHoje = criarIntervaloDoDia(hoje);

  // Active loans past their expected return date are persisted as overdue.
  await atualizarEmprestimosAtrasados();

  // Overdue reminders are limited to one email per loan per day.
  const emprestimos = await prisma.emprestimo.findMany({
    where: {
      status: "Atrasado",
      data_devolucao_real: null,
      OR: [
        {
          data_ultimo_lembrete_atraso: null,
        },
        {
          data_ultimo_lembrete_atraso: {
            lt: intervaloHoje.inicio,
          },
        },
      ],
    },
    include: {
      livro: true,
    },
  });

  for (const emprestimo of emprestimos) {
    try {
      await enviarLembrete({
        emailCliente: emprestimo.email_cliente,
        nomeCliente: emprestimo.nome_cliente,
        tituloLivro: emprestimo.livro.titulo,
        dataPrevista: emprestimo.data_prevista_devolucao,
      });

      await prisma.emprestimo.update({
        where: {
          id: emprestimo.id,
        },
        data: {
          data_ultimo_lembrete_atraso: new Date(),
        },
      });

      await esperar(30000);
    } catch (error) {
      console.error(
        `Erro ao enviar lembrete de atraso para ${emprestimo.email_cliente}:`,
        error,
      );
    }
  }
}

export function iniciarEnvioAutomaticoDeLembretes() {
  // Runs every day at 08:00 to process preventive and overdue reminders.
  cron.schedule("0 8 * * *", async () => {
    try {
      console.log("Iniciando processamento automático de lembretes.");

      await enviarLembretePreventivo();
      await enviarLembreteDeAtraso();

      console.log("Lembretes automáticos processados com sucesso.");
    } catch (error) {
      console.error("Erro ao processar lembretes automáticos:", error);
    }
  });
}
