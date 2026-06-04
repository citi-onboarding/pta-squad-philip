"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { StatCard } from "@/components/statCard";
import { BookOpen, Clock, CircleAlert } from "lucide-react";
import DashboardChart from "@/components/dashboardChart";
import { Badge } from "@/components/bagde";

const statusMap: Record<string, "Em andamento" | "Devolvido" | "Atrasado"> = {
  Em_andamento: "Em andamento",
  Devolvido: "Devolvido",
  Atrasado: "Atrasado",
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

const allCategories = [
  "Romance",
  "Tecnologia",
  "História",
  "Ciências",
  "Infantil",
];

const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function Home() {
  const { data } = useDashboard();

  const allBooksByCategory = allCategories.map((categoria) => {
    const finded = data.livrosPorCategoria.find(
      (item) => normalize(item.categoria) === normalize(categoria),
    );

    return {
      categoria,
      quantidade: finded?.quantidade ?? 0,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto flex w-full flex-col gap-6 sm:w-[90vw] md:w-[80vw] lg:w-[70vw]">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Visão geral da biblioteca</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            typeCard="Total de Livros"
            icon={BookOpen}
            value={data.totalLivros}
          />

          <StatCard
            typeCard="Empréstimos Ativos"
            icon={Clock}
            value={data.emprestimosAtivos}
          />

          <StatCard
            typeCard="Livros Atrasados"
            icon={CircleAlert}
            value={data.livrosAtrasados}
          />
        </div>

        <DashboardChart
          booksByCategory={allBooksByCategory}
          mostBorrowedBooks={data.livrosMaisEmprestados ?? []}
          loansByCategory={data.emprestimosPorCategoria ?? []}
        />

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-700">
            Últimos Empréstimos
          </h2>

          <div className="no-scrollbar overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="w-[35%] px-4 py-3 text-left text-sm font-semibold">
                    Livro
                  </th>
                  <th className="w-[20%] px-4 py-3 text-left text-sm font-semibold">
                    Cliente
                  </th>
                  <th className="w-[15%] px-4 py-3 text-left text-sm font-semibold">
                    Data de Locação
                  </th>
                  <th className="w-[15%] px-4 py-3 text-left text-sm font-semibold">
                    Data de Devolução
                  </th>
                  <th className="w-[15%] px-4 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.ultimosEmprestimos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-sm text-gray-400"
                    >
                      Nenhum empréstimo registrado ainda.
                    </td>
                  </tr>
                ) : (
                  data.ultimosEmprestimos.map((emprestimo) => (
                    <tr
                      key={emprestimo.id}
                      className="border-b border-gray-50 transition-colors hover:bg-gray-50"
                    >
                      <td className="w-[35%] px-4 py-3 text-gray-800">
                        {emprestimo.livro.titulo}
                      </td>

                      <td className="w-[20%] px-4 py-3 text-gray-600">
                        {emprestimo.nome_cliente}
                      </td>

                      <td className="w-[15%] px-4 py-3 text-gray-600">
                        {formatDate(emprestimo.data_locacao)}
                      </td>

                      <td className="w-[15%] px-4 py-3 text-gray-600">
                        {formatDate(emprestimo.data_prevista_devolucao)}
                      </td>

                      <td className="w-[15%] px-4 py-3">
                        <Badge status={statusMap[emprestimo.status]} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
