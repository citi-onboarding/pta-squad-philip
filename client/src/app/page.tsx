"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/statCard";
import { BookOpen, Clock, CircleAlert } from "lucide-react";
import api from "@/services/api";
import CategoryChart from "@/components/categoryChart";
import { Badge } from "@/components/bagde";

const statusMap: Record<string, "Em andamento" | "Devolvido" | "Atrasado"> = {
  Em_andamento: "Em andamento",
  Devolvido: "Devolvido",
  Atrasado: "Atrasado",
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

const mockData = {
  totalLivros: 1245,
  emprestimosAtivos: 87,
  livrosAtrasados: 12,
  livrosPorCategoria: [
    { categoria: "Romance", quantidade: 240 },
    { categoria: "Tecnologia", quantidade: 310 },
    { categoria: "História", quantidade: 175 },
    { categoria: "Ciências", quantidade: 265 },
    { categoria: "Infantil", quantidade: 235 },
  ],
  ultimosEmprestimos: [
    {
      id: "1",
      nome_cliente: "João Silva",
      data_locacao: "2026-04-20T00:00:00.000Z",
      data_prevista_devolucao: "2026-04-27T00:00:00.000Z",
      status: "Em_andamento",
      livro: { titulo: "Clean Code" },
    },
    {
      id: "2",
      nome_cliente: "Maria Santos",
      data_locacao: "2026-04-18T00:00:00.000Z",
      data_prevista_devolucao: "2026-04-25T00:00:00.000Z",
      status: "Atrasado",
      livro: { titulo: "O Pequeno Príncipe" },
    },
    {
      id: "3",
      nome_cliente: "Pedro Costa",
      data_locacao: "2026-04-15T00:00:00.000Z",
      data_prevista_devolucao: "2026-04-22T00:00:00.000Z",
      status: "Devolvido",
      livro: { titulo: "Dom Casmurro" },
    },
    {
      id: "4",
      nome_cliente: "Ana Oliveira",
      data_locacao: "2026-04-22T00:00:00.000Z",
      data_prevista_devolucao: "2026-04-29T00:00:00.000Z",
      status: "Em_andamento",
      livro: { titulo: "JavaScript: The Good Parts" },
    },
  ],
};

const todasCategorias = ["Romance", "Tecnologia", "História", "Ciências", "Infantil"];

export default function Home() {
  const [data, setData] = useState(mockData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard");
        setData(response.data);
      } catch (error) {
        console.warn("Back indisponível, usando mock.");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // atualiza a cada 15 segundos

    return () => clearInterval(interval);
  }, []);

  const livrosPorCategoriaCompleto = todasCategorias.map((categoria) => {
    const encontrado = data.livrosPorCategoria.find((item) => item.categoria === categoria);
    return { categoria, quantidade: encontrado?.quantidade ?? 0 };
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
          <CategoryChart data={livrosPorCategoriaCompleto} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Últimos Empréstimos
          </h2>
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
                    <tr
                      key={emprestimo.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
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