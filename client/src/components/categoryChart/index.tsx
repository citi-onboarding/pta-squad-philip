"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

interface CategoryData {
  quantidade: number;
  categoria: string;
}

interface CategoryChartProps {
  data: CategoryData[];
}

const mapCategoryLabel = [
  { label: "Romance", value: "Rom." },
  { label: "Tecnologia", value: "Tec." },
  { label: "História", value: "Hist." },
  { label: "Ciências", value: "Cien." },
  { label: "Infantil", value: "Inf." },
];

const chartConfig = {
  quantidade: {
    label: "Livros",
    color: "#00C389",
  },
} satisfies ChartConfig;
export default function CategoryChart({ data }: CategoryChartProps) {
  const isEmpty = data.every((item) => item.quantidade === 0);

  if (isEmpty) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center text-gray-400 text-sm">
        Nenhum livro cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="w-full h-[250px]">
      <ChartContainer config={chartConfig} className="h-full w-full min-w-0">
        <BarChart
          data={data}
          barCategoryGap="30%"
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="categoria"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6B7280" }}
          />
          <Bar
            dataKey="quantidade"
            fill="var(--color-quantidade)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
