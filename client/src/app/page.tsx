"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { StatCard } from "@/components/statCard";
import { BookOpen, Clock, CircleAlert } from "lucide-react";
import CategoryChart from "@/components/categoryChart";
import { Badge } from "@/components/bagde";

const statusMap: Record<string, "Em andamento" | "Devolvido" | "Atrasado"> = {
  Em_andamento: "Em andamento",
  Devolvido: "Devolvido",
  Atrasado: "Atrasado",
};

const formatDate = (iso: string) => {
  const [date] = iso.split("T");
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const allCategories = ["Romance", "Tecnologia", "História", "Ciências", "Infantil"];

const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function Home() {
  const { data } = useDashboard()

  const allBooksByCategory = allCategories.map((categoria) => {
    const finded = data.livrosPorCategoria.find(
      (item) => normalize(item.categoria) === normalize(categoria)
    );
    return { categoria, quantidade: finded?.quantidade ?? 0 };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col gap-6 w-full sm:w[90vw] md:w-[80vw] lg:w-[70vw] mx-auto">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Visão geral da biblioteca</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard typeCard="Total de Livros" icon={BookOpen} value={data.totalLivros} />
          <StatCard typeCard="Empréstimos Ativos" icon={Clock} value={data.emprestimosAtivos} />
          <StatCard typeCard="Livros Atrasados" icon={CircleAlert} value={data.livrosAtrasados} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <h2 className="text-base font-semibold text-gray-700 ml-4 mt-2 mb-4">
            Livros por Categoria
          </h2>
          <CategoryChart data={allBooksByCategory} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Últimos Empréstimos</h2>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-3 px-4 font-semibold text-sm text-left w-[35%]">Livro</th>
                  <th className="py-3 px-4 font-semibold text-sm text-left w-[20%]">Cliente</th>
                  <th className="py-3 px-4 font-semibold text-sm text-left w-[15%]">Data de Locação</th>
                  <th className="py-3 px-4 font-semibold text-sm text-left w-[15%]">Data de Devolução</th>
                  <th className="py-3 px-4 font-semibold text-sm text-left w-[15%]">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.ultimosEmprestimos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                      Nenhum empréstimo registrado ainda.
                    </td>
                  </tr>
                ) : (
                  data.ultimosEmprestimos.map((emprestimo) => (
                    <tr key={emprestimo.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-800 w-[35%]">{emprestimo.livro.titulo}</td>
                      <td className="py-3 px-4 text-gray-600 w-[20%]">{emprestimo.nome_cliente}</td>
                      <td className="py-3 px-4 text-gray-600 w-[15%]">{formatDate(emprestimo.data_locacao)}</td>
                      <td className="py-3 px-4 text-gray-600 w-[15%]">{formatDate(emprestimo.data_prevista_devolucao)}</td>
                      <td className="py-3 px-4 w-[15%]">
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