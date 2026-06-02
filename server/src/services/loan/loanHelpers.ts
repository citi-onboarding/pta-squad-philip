import prisma from "@database";

export async function atualizarEmprestimosAtrasados() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  await prisma.emprestimo.updateMany({
    where: {
      status: "Em_andamento",
      data_prevista_devolucao: {
        lt: hoje,
      },
    },
    data: {
      status: "Atrasado",
    },
  });
}
