"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
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
  return (
    <div>
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <BarChart
          data={data}
          barCategoryGap="95%"
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
