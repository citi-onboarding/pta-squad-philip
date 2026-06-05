import { useState, useEffect } from "react";
import { getDashboard, DashboardData } from "@/services/dashboard.service";

const defaultState: DashboardData = {
  totalLivros: 0,
  emprestimosAtivos: 0,
  livrosAtrasados: 0,
  livrosPorCategoria: [],
  livrosMaisEmprestados: [],
  emprestimosPorCategoria: [],
  ultimosEmprestimos: [],
};

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData>(defaultState);

  const fetchDashboard = async () => {
    try {
      const result = await getDashboard();
      setData(result);
    } catch (error) {
      console.warn("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 15000);
    return () => clearInterval(interval);
  }, []);

  return { data };
};
