import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '../bagde';

// Defines the props expected by the LoanHistoryCard component
interface LoanHistoryCardProps {
  id: string;
  nomeCliente: string;
  emailCliente: string;
  dataLocacao: string;
  dataPrevistaDevolucao: string;
  status: "Em_andamento" | "Devolvido" | "Atrasado";
  // Function called when sending a reminder
  onEnviarLembrete: (id: string) => void;
  // Function called when marking a loan as returned
  onDevolver: (id: string) => void;
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
}) => {
  // Format database status string to a user-friendly UI text
  const statusFormatado = status === "Em_andamento" ? "Em andamento" : status;
  // Format the date strings to Brazilian localized date format
  const formatarData = (dataStr: string) => {
    return new Date(dataStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div style={styles.card}>
      {/* Left side content */}
      <div style={styles.leftContent}>
        {/* Customer name and status badge */}
        <div style={styles.nameRow}>
          <span style={styles.name}>{nomeCliente}</span>
          <Badge status={status} text={statusFormatado} />
        </div>

         {/* Customer email */}
        <p style={styles.email}>{emailCliente}</p>
        {/* Rental and expected return dates */}
        <p style={styles.dates}>
          <span style={styles.dateLabel}>Locação: </span>
          <span style={styles.dateValue}>{formatarData(dataLocacao)}</span>
          <span style={{ ...styles.dateLabel, marginLeft: '16px' }}>Previsão: </span>
          <span style={styles.dateValue}>{formatarData(dataPrevistaDevolucao)}</span>
        </p>
      </div>

      {/* Right side action buttons */}
      <div style={styles.rightActions}>
        {/* Show reminder button only if the loan is overdue */}
        {status === "Atrasado" && (
          <Button  
            style={styles.btnReminder}
            onClick={() => onEnviarLembrete(id)}
          >
            <span style={{ marginRight: '6px' }}>✉</span> Enviar Lembrete
          </Button>
        )}

        {/* Show return button if the loan is active or overdue */}
        {(status === "Em_andamento" || status === "Atrasado") && (
          <Button 
            style={styles.btnReturn}
            onClick={() => onDevolver(id)}
          >
            Devolvido
          </Button>
        )}
      </div>
    </div>
  );
};

const styles = {
  // Main card container
  card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '16px', background: '#fff' },
  // Left section layout
  leftContent: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  // Row containing customer name and badge
  nameRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  // Customer name styling
  name: { fontSize: '16px', fontWeight: 500, color: '#1e293b' },
  // Customer email styling
  email: { fontSize: '14px', color: '#64748b', margin: 0 },
  // Dates container styling
  dates: { fontSize: '14px', margin: 0 },
  // Label style for dates
  dateLabel: { color: '#94a3b8' },
  // Value style for dates
  dateValue: { color: '#334155' },
  // Right section actions layout
  rightActions: { display: 'flex', gap: '12px', alignItems: 'center' },
  // Reminder button styling
  btnReminder: { borderColor: '#10b981', color: '#10b981', background: 'transparent', borderRadius: '8px', padding: '10px 18px', fontWeight: 500, cursor: 'pointer' },
  // Return button styling
  btnReturn: { background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 500, cursor: 'pointer' }
};