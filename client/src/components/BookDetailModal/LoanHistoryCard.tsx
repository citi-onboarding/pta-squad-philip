import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "../bagde";
import { Mail } from "lucide-react";
import { useState, useEffect } from "react";

// Defines the props expected by the LoanHistoryCard component
interface LoanHistoryCardProps {
  id: string;
  nomeCliente: string;
  emailCliente: string;
  dataLocacao: string;
  dataPrevistaDevolucao: string;
  status: "Em_andamento" | "Em andamento" | "Devolvido" | "Atrasado";
  // Function called when sending a reminder
  onEnviarLembrete: (id: string) => void;
  // Function called when marking a loan as returned
  onDevolver: (id: string) => void;
  // Controls loading state for the reminder button
  lembreteLoading: boolean;
  // Controls loading state for the return button
  devolucaoLoading: boolean;
}

// Loan history card component
export const LoanHistoryCard: React.FC<LoanHistoryCardProps> = ({
  id,
  nomeCliente,
  emailCliente,
  dataLocacao,
  dataPrevistaDevolucao,
  status,
  onEnviarLembrete,
  onDevolver,
  lembreteLoading,
  devolucaoLoading,
}) => {
  // Format database status string to a user-friendly UI text
  const statusFormatado = status === "Em_andamento" ? "Em andamento" : status;

  // Checks which actions are available according to loan status
  const isAtrasado = status === "Atrasado";
  const isEmAndamento = status === "Em_andamento" || status === "Em andamento";
  const podeEnviarLembrete = isAtrasado;
  const podeMarcarComoDevolvido = isAtrasado || isEmAndamento;

  // Format the date strings to Brazilian localized date format
  const formatarData = (dataStr: string) => {
    return new Date(dataStr).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      style={{
        ...styles.card,
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
      }}
    >
      {/* Left side content */}
      <div style={styles.leftContent}>
        <div style={styles.nameRow}>
          <span style={styles.name}>{nomeCliente}</span>
          <Badge status={statusFormatado as any} text={statusFormatado} />
        </div>

        <p style={styles.email}>{emailCliente}</p>

        <p style={styles.dates}>
          <span style={styles.dateLabel}>Locação: </span>
          <span style={styles.dateValue}>{formatarData(dataLocacao)}</span>
          <span style={{ ...styles.dateLabel, marginLeft: "16px" }}>
            Previsão:{" "}
          </span>
          <span style={styles.dateValue}>
            {formatarData(dataPrevistaDevolucao)}
          </span>
        </p>
      </div>

      {/* Right side action buttons */}
      <div
        style={{
          ...styles.rightActions,
          marginTop: isMobile ? "12px" : "0",
          width: isMobile ? "100%" : "auto",
          justifyContent: isMobile ? "flex-end" : "center",
        }}
      >
        {podeEnviarLembrete && (
          <Button
            style={{
              ...styles.btnReminder,
              cursor:
                lembreteLoading || devolucaoLoading ? "not-allowed" : "pointer",
              opacity: lembreteLoading || devolucaoLoading ? 0.7 : 1,
            }}
            onClick={() => onEnviarLembrete(id)}
            disabled={lembreteLoading || devolucaoLoading}
          >
            <Mail size={16} strokeWidth={2} />
            {lembreteLoading ? "Enviando..." : "Enviar Lembrete"}
          </Button>
        )}

        {podeMarcarComoDevolvido && (
          <Button
            style={{
              ...styles.btnReturn,
              cursor:
                devolucaoLoading || lembreteLoading ? "not-allowed" : "pointer",
              opacity: devolucaoLoading || lembreteLoading ? 0.7 : 1,
            }}
            onClick={() => onDevolver(id)}
            disabled={devolucaoLoading || lembreteLoading}
          >
            {devolucaoLoading ? "Processando..." : "Marcar como Devolvido"}
          </Button>
        )}
      </div>
    </div>
  );
};

const styles = {
  // Main card container
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    background: "#fff",
  },
  // Left section layout
  leftContent: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "6px",
  },
  // Row containing customer name and badge
  nameRow: { display: "flex", alignItems: "center", gap: "8px" },
  // Customer name styling
  name: { fontSize: "16px", fontWeight: 500, color: "#1e293b" },
  // Customer email styling
  email: { fontSize: "14px", color: "#64748b", margin: 0 },
  // Dates container styling
  dates: { fontSize: "14px", margin: 0 },
  // Label style for dates
  dateLabel: { color: "#94a3b8" },
  // Value style for dates
  dateValue: { color: "#334155" },
  // Right section actions layout
  rightActions: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: "auto",
    flexShrink: 0,
  },
  // Reminder button styling
  btnReminder: {
    border: "1px solid #10b981",
    color: "#10b981",
    background: "transparent",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    height: "42px",
    whiteSpace: "nowrap" as const,
  },

  // Return button styling
  btnReturn: {
    border: "1px solid #10b981",
    background: "#10b981",
    color: "#fff",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "42px",
    whiteSpace: "nowrap" as const,
  },
};
