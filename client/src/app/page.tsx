"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/statCard";
import { BookOpen, Clock, CircleAlert } from "lucide-react";
import api from "@/services/api";
import CategoryChart from "@/components/categoryChart";
import { Badge } from "@/components/bagde";

// Tipagem
interface Livro {
  titulo: string;
}

interface Emprestimo {
  id: string;
  nome_cliente: string;
  data_locacao: string;
  data_prevista_devolucao: string;
  status: string;
  livro: Livro;
}

interface CategoriaDado {
  categoria: string;
  quantidade: number;
}

interface DashboardData {
  totalLivros: number;
  emprestimosAtivos: number;
  livrosAtrasados: number;
  livrosPorCategoria: CategoriaDado[];
  ultimosEmprestimos: Emprestimo[];
}

const statusMap: Record<string, "Em andamento" | "Devolvido" | "Atrasado"> = {
  Em_andamento: "Em andamento",
  Devolvido: "Devolvido",
  Atrasado: "Atrasado",
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

const todasCategorias = [
  "Romance",
  "Tecnologia",
  "História",
  "Ciências",
  "Infantil",
];

// Estado inicial vazio mas válido — evita erros antes do primeiro fetch
const defaultState: DashboardData = {
  totalLivros: 0,
  emprestimosAtivos: 0,
  livrosAtrasados: 0,
  livrosPorCategoria: [],
  ultimosEmprestimos: [],
};

export default function Home() {
  const [data, setData] = useState<DashboardData>(defaultState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<DashboardData>("/dashboard");
        setData(response.data);
      } catch (error) {
        console.warn("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);

    return () => clearInterval(interval);
  }, []);

  const livrosPorCategoriaCompleto = todasCategorias.map((categoria) => {
    const encontrado = data.livrosPorCategoria.find(
      (item) => item.categoria === categoria,
    );
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
                  <th className="py-3 px-4 font-semibold text-sm text-left w-[35%]">
                    Livro
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-left w-[20%]">
                    Cliente
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-left w-[15%]">
                    Data de Locação
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-left w-[15%]">
                    Data de Devolução
                  </th>
                  <th className="py-3 px-4 font-semibold text-sm text-left w-[15%]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.ultimosEmprestimos.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-400 text-sm"
                    >
                      Nenhum empréstimo registrado ainda.
                    </td>
                  </tr>
                ) : (
                  data.ultimosEmprestimos.map((emprestimo) => (
                    <tr
                      key={emprestimo.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-gray-800 w-[35%]">
                        {emprestimo.livro.titulo}
                      </td>
                      <td className="py-3 px-4 text-gray-600 w-[20%]">
                        {emprestimo.nome_cliente}
                      </td>
                      <td className="py-3 px-4 text-gray-600 w-[15%]">
                        {formatDate(emprestimo.data_locacao)}
                      </td>
                      <td className="py-3 px-4 text-gray-600 w-[15%]">
                        {formatDate(emprestimo.data_prevista_devolucao)}
                      </td>
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
