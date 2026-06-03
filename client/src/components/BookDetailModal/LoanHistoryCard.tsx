import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "../bagde";
import { Mail } from "lucide-react";
import { useState, useEffect } from "react";

// Defines the props expected by the LoanHistoryCard component
interface LoanHistoryCardProps {
  id: string;
  clientName: string;
  clientEmail: string;
  loanDate: string;
  expectedReturnDate: string;
  status: "Em_andamento" | "Em andamento" | "Devolvido" | "Atrasado";
  // Function called when sending a reminder
  onSendReminder: (id: string) => void;
  // Function called when marking a loan as returned
  onReturn: (id: string) => void;
  // Controls loading state for the reminder button
  reminderLoading: boolean;
  // Controls loading state for the return button
  returnLoading: boolean;
}

// Loan history card component
export const LoanHistoryCard: React.FC<LoanHistoryCardProps> = ({
  id,
  clientName,
  clientEmail,
  loanDate,
  expectedReturnDate,
  status,
  onSendReminder,
  onReturn,
  reminderLoading,
  returnLoading,
}) => {
  // Format database status string to a user-friendly UI text
  const formattedStatus = status === "Em_andamento" ? "Em andamento" : status;

  // Checks which actions are available according to loan status
  const isLate = status === "Atrasado";
  const isInProgress = status === "Em_andamento" || status === "Em andamento";
  const canSendReminder = isLate;
  const canMarkAsReturned = isLate || isInProgress;

  // Format the date strings to Brazilian localized date format
  const formatDate = (dataStr: string) => {
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
        alignItems: isMobile ? "stretch" : "center",
      }}
    >
      {/* Left side content */}
      <div
        style={{
          ...styles.leftContent,
          width: isMobile ? "100%" : "auto",
        }}
      >
        <div
          style={{
            ...styles.nameRow,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <span style={styles.name}>{clientName}</span>
          <Badge status={formattedStatus as any} />
        </div>

        <p style={styles.email}>{clientEmail}</p>

        {/* Dates displayed as separated groups to avoid bad line breaks on mobile */}
        <div
          style={{
            ...styles.datesContainer,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "6px" : "16px",
            alignItems: isMobile ? "flex-start" : "center",
          }}
        >
          <div style={styles.dateGroup}>
            <span style={styles.dateLabel}>Locação:</span>
            <span style={styles.dateValue}>{formatDate(loanDate)}</span>
          </div>

          <div style={styles.dateGroup}>
            <span style={styles.dateLabel}>Previsão:</span>
            <span style={styles.dateValue}>
              {formatDate(expectedReturnDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Right side action buttons */}
      <div
        style={{
          ...styles.rightActions,
          flexDirection: isMobile ? "column" : "row",
          marginTop: isMobile ? "16px" : "0",
          width: isMobile ? "100%" : "auto",
          alignItems: isMobile ? "stretch" : "center",
          justifyContent: isMobile ? "flex-start" : "flex-end",
        }}
      >
        {canSendReminder && (
          <Button
            style={{
              ...styles.btnReminder,
              width: isMobile ? "100%" : "auto",
              cursor:
                reminderLoading || returnLoading ? "not-allowed" : "pointer",
              opacity: reminderLoading || returnLoading ? 0.7 : 1,
            }}
            onClick={() => onSendReminder(id)}
            disabled={reminderLoading || returnLoading}
          >
            <Mail size={16} strokeWidth={2} />
            {reminderLoading ? "Enviando..." : "Enviar Lembrete"}
          </Button>
        )}

        {canMarkAsReturned && (
          <Button
            style={{
              ...styles.btnReturn,
              width: isMobile ? "100%" : "auto",
              cursor:
                returnLoading || reminderLoading ? "not-allowed" : "pointer",
              opacity: returnLoading || reminderLoading ? 0.7 : 1,
            }}
            onClick={() => onReturn(id)}
            disabled={returnLoading || reminderLoading}
          >
            {returnLoading ? "Processando..." : "Marcar como Devolvido"}
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
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  // Customer name styling
  name: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#1e293b",
  },

  // Customer email styling
  email: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
    wordBreak: "break-word" as const,
  },

  // Dates container styling
  datesContainer: {
    display: "flex",
    fontSize: "14px",
    margin: 0,
    flexWrap: "wrap" as const,
  },

  // Individual date group styling
  dateGroup: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
    whiteSpace: "nowrap" as const,
  },

  // Label style for dates
  dateLabel: {
    color: "#94a3b8",
  },

  // Value style for dates
  dateValue: {
    color: "#334155",
  },

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
