"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ChartType =
  | "books-by-category"
  | "most-borrowed-books"
  | "loans-by-category";

interface DashboardChartProps {
  booksByCategory: {
    categoria: string;
    quantidade: number;
  }[];
  mostBorrowedBooks: {
    titulo: string;
    quantidade: number;
  }[];
  loansByCategory: {
    categoria: string;
    quantidade: number;
  }[];
}

interface ChartItem {
  name: string;
  quantidade: number;
}

const chartConfig = {
  quantidade: {
    label: "Quantidade",
    color: "#00C389",
  },
} satisfies ChartConfig;

const chartOptions = [
  {
    value: "books-by-category",
    label: "Livros por categoria",
  },
  {
    value: "most-borrowed-books",
    label: "Livros mais emprestados",
  },
  {
    value: "loans-by-category",
    label: "Empréstimos por categoria",
  },
] satisfies {
  value: ChartType;
  label: string;
}[];

const allCategories = [
  "Romance",
  "Tecnologia",
  "História",
  "Ciências",
  "Infantil",
];

const emptyMostBorrowedBooksSlots = [
  "Livro 1",
  "Livro 2",
  "Livro 3",
  "Livro 4",
  "Livro 5",
];

const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function DashboardChart({
  booksByCategory = [],
  mostBorrowedBooks = [],
  loansByCategory = [],
}: DashboardChartProps) {
  const [selectedChart, setSelectedChart] =
    useState<ChartType>("books-by-category");

  const selectedOption = chartOptions.find(
    (option) => option.value === selectedChart,
  );

  const normalizedBooksByCategory = allCategories.map((categoria) => {
    const found = booksByCategory.find(
      (item) => normalize(item.categoria) === normalize(categoria),
    );

    return {
      name: categoria,
      quantidade: found?.quantidade ?? 0,
    };
  });

  const normalizedLoansByCategory = allCategories.map((categoria) => {
    const found = loansByCategory.find(
      (item) => normalize(item.categoria) === normalize(categoria),
    );

    return {
      name: categoria,
      quantidade: found?.quantidade ?? 0,
    };
  });

  const normalizedMostBorrowedBooks = emptyMostBorrowedBooksSlots.map(
    (fallbackName, index) => {
      const book = mostBorrowedBooks[index];

      return {
        name: book?.titulo ?? fallbackName,
        quantidade: book?.quantidade ?? 0,
      };
    },
  );

  const chartData: ChartItem[] =
    selectedChart === "books-by-category"
      ? normalizedBooksByCategory
      : selectedChart === "most-borrowed-books"
      ? normalizedMostBorrowedBooks
      : normalizedLoansByCategory;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-gray-700">
          Estatísticas da Biblioteca
        </h2>

        <select
          value={selectedChart}
          onChange={(event) =>
            setSelectedChart(event.target.value as ChartType)
          }
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition-all hover:border-slate-400 focus:border-[#00C389] focus:ring-2 focus:ring-[#00C389]/20"
        >
          {chartOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm text-slate-500">{selectedOption?.label}</p>

      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />

          <ChartTooltip
            cursor={{ fill: "rgba(0, 0, 0, 0.04)" }}
            content={
              <ChartTooltipContent
                formatter={(value) => [`Quantidade: ${value}`, ""]}
              />
            }
          />

          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
          />

          <YAxis tickLine={false} axisLine={false} fontSize={12} />

          <Bar
            dataKey="quantidade"
            fill="var(--color-quantidade)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </section>
  );
}
