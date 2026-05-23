import React, { useEffect, useState } from 'react';
import api from "@/services/api"; 
import { LoanHistoryCard } from './LoanHistoryCard';

// Static asset mapping matching book categories to local covers
const capas: Record<string, string> = {
  Romance: '/img/romance.jpg',
  Tecnologia: '/img/tecnologia.jpg',
  Historia: '/img/historia.jpg',
  Ciencias: '/img/ciencias.jpg',
  Infantil: '/img/infantil.jpg',
}

// Interface representing a loan returned by the backend
interface EmprestimoBackend {
  id: string;
  nome_cliente: string;
  email_cliente: string;
  data_locacao: string;
  data_prevista_devolucao: string;
  status: "Em_andamento" | "Devolvido" | "Atrasado";
}

// Interface representing the complete book data
interface LivroDados {
  titulo: string;
  autor: string;
  isbn: string;
  editora: string;
  ano: number;
  categoria: string;
  quantidade_total: number;
  quantidade_disponivel: number;
  emprestimos: EmprestimoBackend[];
}

// Props expected by the BookDetailModal component
interface BookDetailModalProps {
  id: string;        // Book id used to fetch details
  isOpen: boolean;   // Controls whether the modal is open or closed
  onClose: () => void;  // Function called when closing the modal
}

// Book details modal component
export const BookDetailModal: React.FC<BookDetailModalProps> = ({ id, isOpen, onClose }) => {
  // Stores fetched book data
  const [livro, setLivro] = useState<LivroDados | null>(null);
  // Controls loading state
  const [loading, setLoading] = useState<boolean>(false);

  // Fetches book details when the modal opens
  useEffect(() => {
    if (isOpen && id) {
      // Async function to fetch book data from the API
      const buscarLivro = async () => {
        try {
          setLoading(true);
          
          const response = await api.get(`/livros/${id}`);
          setLivro(response.data);
        } catch (error) {
          console.error("Erro ao buscar detalhes do livro:", error);
        } finally {
          setLoading(false);
        }
      };
      buscarLivro();
    }
  }, [isOpen, id]);

  // Prevents rendering if the modal is closed
  if (!isOpen) return null;

  /// Sorts loans by most recent rental date and selects only the last 3 loans
  const tresUltimos = livro?.emprestimos
    ? [...livro.emprestimos]
        .sort((a, b) => new Date(b.data_locacao).getTime() - new Date(a.data_locacao).getTime())
        .slice(0, 3)
    : [];

  // Temporary log used before backend action integration
  const handleEnviarLembrete = (emprestimoId: string) => {
    console.log(`Enviar Lembrete acionado para o ID: ${emprestimoId}`);
  };

  // Temporary log used before backend action integration
  const handleDevolver = (emprestimoId: string) => {
    console.log(`Marcar como Devolvido acionado para o ID: ${emprestimoId}`);
  };

  return (
    // Modal overlay background
    <div style={styles.overlay}>
      {/* Main modal container */}
      <div style={styles.modalBox}>
        {/* Modal header with close button */}
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>Detalhes do Livro</span>
          <button onClick={onClose} style={styles.closeX}>&times;</button>
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={styles.centerMessage}>Carregando informações...</div>
        ) : livro ? (
          <div style={styles.modalContent}>
            
            {/* Top section - Book information */}
            <div style={styles.bookDetailsContainer}>
              {/* Book cover image */}
              <div style={styles.coverBox}>
                <img 
                  src={capas[livro.categoria] || '/img/default.jpg'} 
                  alt={livro.titulo} 
                  style={styles.coverImg} 
                />
              </div>

              {/* Book information area */}              
              <div style={styles.infoBox}>
                <h2 style={styles.bookTitle}>{livro.titulo}</h2>
                <p style={styles.bookAuthor}>{livro.autor}</p>
                
                {/* Grid containing book metadata */}
                <div style={styles.detailsGrid}>
                  <div>
                    <span style={styles.label}>ISBN</span>
                    <p style={styles.value}>{livro.isbn}</p>
                  </div>
                  <div>
                    <span style={styles.label}>Categoria</span>
                    <p style={{ ...styles.value, color: '#10b981' }}>{livro.categoria}</p>
                  </div>
                  <div>
                    <span style={styles.label}>Editora</span>
                    <p style={styles.value}>{livro.editora}</p>
                  </div>
                  <div>
                    <span style={styles.label}>Ano</span>
                    <p style={styles.value}>{livro.ano}</p>
                  </div>
                  <div>
                    <span style={styles.label}>Quantidade Total</span>
                    <p style={styles.value}>{livro.quantidade_total} unidades</p>
                  </div>
                  <div>
                    <span style={styles.label}>Quantidade Disponível</span>
                    <p style={{ ...styles.value, color: '#10b981' }}>{livro.quantidade_disponivel} unidades</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom section - Loan history */}
            <h3 style={styles.historyTitle}>Histórico de Empréstimos</h3>
            
            <div style={styles.historyContainer}>
              {/* Displays loan cards if loans exist */}
              {tresUltimos.length > 0 ? (
                tresUltimos.map((loan) => (
                  <LoanHistoryCard
                    key={loan.id}
                    id={loan.id}
                    nomeCliente={loan.nome_cliente}
                    emailCliente={loan.email_cliente}
                    dataLocacao={loan.data_locacao}
                    dataPrevistaDevolucao={loan.data_prevista_devolucao}
                    status={loan.status}
                    onEnviarLembrete={handleEnviarLembrete}
                    onDevolver={handleDevolver}
                  />
                ))
              ) : (
                // Message displayed when no loan history exists
                <p style={styles.noHistory}>Nenhum empréstimo registrado para este livro.</p>
              )}
            </div>

          </div>
        ) : (
          // Error message if the book data could not be loaded
          <div style={styles.centerMessage}>Não foi possível carregar os detalhes do livro selecionado.</div>
        )}
      </div>
    </div>
  );
};

const styles = {
  // Dark background overlay
  overlay: { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  // Main modal container styling
  modalBox: { background: '#fff', borderRadius: '12px', width: '760px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' as const, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  // Modal header layout
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #f1f5f9' },
  // Modal title styling
  modalTitle: { fontSize: '20px', fontWeight: 'bold' as const, color: '#0f172a' },
  // Close button styling
  closeX: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' },
  // Modal content spacing
  modalContent: { padding: '32px' },
  // Centered message styling
  centerMessage: { padding: '48px', textAlignment: 'center' as const, color: '#64748b', fontSize: '16px' },
  // Container for book details section
  bookDetailsContainer: { display: 'flex', gap: '32px', marginBottom: '32px' },
  // Book cover container
  coverBox: { width: '150px', height: '210px', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden' },
  // Book cover image styling
  coverImg: { width: '100%', height: '100%', objectFit: 'cover' as const },
  // Book information area
  infoBox: { flex: 1 },
  // Book title styling
  bookTitle: { fontSize: '22px', fontWeight: 'bold' as const, color: '#0f172a', margin: '0 0 4px 0' },
  // Book author styling
  bookAuthor: { fontSize: '15px', color: '#64748b', margin: '0 0 24px 0' },
  // Grid for book metadata
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' },
  // Label styling
  label: { fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '2px' },
  // Value styling
  value: { fontSize: '15px', fontWeight: 500, color: '#334155', margin: 0 },
  // Loan history title styling
  historyTitle: { fontSize: '18px', fontWeight: 'bold' as const, color: '#0f172a', marginBottom: '20px', marginTop: '12px' },
  // Loan history container layout
  historyContainer: { display: 'flex', flexDirection: 'column' as const },
  // Message displayed when there is no history
  noHistory: { color: '#94a3b8', fontStyle: 'italic' as const, fontSize: '14px', marginTop: '4px' }
};