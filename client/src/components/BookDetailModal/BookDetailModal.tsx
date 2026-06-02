import React, { useEffect, useState } from "react";
import { LoanHistoryCard } from "./LoanHistoryCard";
import { BookDetails } from "@/services/books.service";
import { getBookById as getBookDetails, } from "@/services/books.service";
import { sendLoanReminder, returnLoan as returnBookLoan } from "@/services/loans.service";

// Static asset mapping matching book categories to local covers
const capas: Record<string, string> = {
  Romance: "/Capas de Livros/Romance.png",
  Tecnologia: "/Capas de Livros/Tecnologia.png",
  História: "/Capas de Livros/Historia.png",
  Ciências: "/Capas de Livros/Ciencias.png",
  Infantil: "/Capas de Livros/Infantil.png",
};

// Props expected by the BookDetailModal component
interface BookDetailModalProps {
  id: string; // Book id used to fetch details
  isOpen: boolean; // Controls whether the modal is open or closed
  onClose: () => void; // Function called when closing the modal
  onReturnSuccess?: () => void;
}

// Book details modal component
export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  id,
  isOpen,
  onClose,
  onReturnSuccess,
}) => {
  // Stores fetched book data
  const [book, setBook] = useState<BookDetails | null>(null);

  // Controls loading state while fetching book details
  const [loading, setLoading] = useState<boolean>(false);

  // Stores the loan id currently sending a reminder email
  const [reminderLoadingId, setReminderLoadingId] = useState<string | null>(
    null,
  );

  // Stores the loan id currently being returned
  const [returnLoadingId, setReturnLoadingId] = useState<string | null>(
    null,
  );

  // Controls mobile layout behavior
  const [isMobile, setIsMobile] = useState(false);

  // Checks the screen width to adjust modal layout on small screens
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fetches book details from the service
  const fetchBook = async () => {
    try {
      setLoading(true);

      const bookDetails = await getBookDetails(id);
      setBook(bookDetails);
    } catch (error) {
      console.error("Erro ao buscar detalhes do livro:", error);
      alert("Erro ao carregar detalhes do livro.");
    } finally {
      setLoading(false);
    }
  };

  // Fetches book details when the modal opens
  useEffect(() => {
    if (isOpen && id) {
      fetchBook();
    }
  }, [isOpen, id]);

  // Prevents rendering if the modal is closed
  if (!isOpen) return null;

  // Sorts loans by most recent rental date and selects only the last 3 loans
  const lastThree = book?.emprestimos
    ? [...book.emprestimos]
        .sort(
          (a, b) =>
            new Date(b.data_locacao).getTime() -
            new Date(a.data_locacao).getTime(),
        )
        .slice(0, 3)
    : [];

  // Sends a reminder email for overdue loans
  const handleSendReminder = async (emprestimoId: string) => {
    try {
      setReminderLoadingId(emprestimoId);

      await sendLoanReminder(emprestimoId);

      alert("E-mail de lembrete enviado com sucesso.");
    } catch (error) {
      console.error("Erro ao enviar lembrete:", error);
      alert("Falha ao enviar o e-mail de lembrete.");
    } finally {
      setReminderLoadingId(null);
    }
  };

  // Marks a loan as returned and refreshes the book details
  const handleReturn = async (emprestimoId: string) => {
    try {
      setReturnLoadingId(emprestimoId);

      await returnBookLoan(emprestimoId);

      alert(
        "Livro marcado como devolvido e e-mail de confirmação enviado com sucesso.",
      );

      await fetchBook();

      await onReturnSuccess?.();
    } catch (error) {
      console.error("Erro ao marcar como devolvido:", error);
      alert("Falha ao marcar o livro como devolvido.");
    } finally {
      setReturnLoadingId(null);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{
          ...styles.modalBox,
          overflowY: "auto",
          scrollbarWidth: "none",
        }}
        className="custom-scroll-invisivel"
        onClick={(e) => e.stopPropagation()}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
        ::-webkit-scrollbar {
          display: none !important;
        }
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      `,
          }}
        />

        {/* Modal header with close button */}
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>Detalhes do Livro</span>
          <button onClick={onClose} style={styles.closeX}>
            &times;
          </button>
        </div>

        {/* Loading state */}
        {loading ? (
          <div style={styles.centerMessage}>Carregando informações...</div>
        ) : book ? (
          <div style={styles.modalContent}>
            {/* Top section - Book information */}
            <div
              style={{
                ...styles.bookDetailsContainer,
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "center" : "flex-start",
              }}
            >
              {/* Book cover image */}
              <div
                style={{
                  ...styles.coverBox,
                  width: isMobile ? "100%" : "150px",
                  height: isMobile ? "220px" : "210px",
                  marginBottom: isMobile ? "20px" : "0",
                }}
              >
                <img
                  src={capas[book.categoria] || "/img/default.jpg"}
                  alt={book.titulo}
                  style={styles.coverImg}
                />
              </div>

              {/* Book information area */}
              <div
                style={{
                  ...styles.infoBox,
                  width: isMobile ? "100%" : undefined,
                }}
              >
                <h2 style={styles.bookTitle}>{book.titulo}</h2>
                <p style={styles.bookAuthor}>{book.autor}</p>

                {/* Grid containing book metadata */}
                <div style={styles.detailsGrid}>
                  <div style={{ width: "50%", marginBottom: "18px" }}>
                    <span style={styles.label}>ISBN</span>
                    <p style={styles.value}>{book.isbn}</p>
                  </div>

                  <div style={{ width: "50%", marginBottom: "18px" }}>
                    <span style={styles.label}>Categoria</span>
                    <p style={{ ...styles.value, color: "#10b981" }}>
                      {book.categoria}
                    </p>
                  </div>

                  <div style={{ width: "50%", marginBottom: "18px" }}>
                    <span style={styles.label}>Editora</span>
                    <p style={styles.value}>{book.editora}</p>
                  </div>

                  <div style={{ width: "50%", marginBottom: "18px" }}>
                    <span style={styles.label}>Ano</span>
                    <p style={styles.value}>{book.ano}</p>
                  </div>

                  <div style={{ width: "50%" }}>
                    <span style={styles.label}>Quantidade Total</span>
                    <p style={styles.value}>
                      {book.quantidade_total} unidades
                    </p>
                  </div>

                  <div style={{ width: "50%" }}>
                    <span style={styles.label}>Quantidade Disponível</span>
                    <p style={{ ...styles.value, color: "#10b981" }}>
                      {book.quantidade_disponivel} unidades
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom section - Loan history */}
            <h3 style={styles.historyTitle}>Histórico de Empréstimos</h3>

            <div
              style={{
                ...styles.historyContainer,
                maxHeight: "420px",
                overflowY: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="custom-scroll-invisivel"
            >
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                .custom-scroll-invisivel::-webkit-scrollbar {
                  display: none !important;
                }
              `,
                }}
              />

              {/* Displays loan cards if loans exist */}
              {lastThree.length > 0 ? (
                lastThree.map((loan) => (
                  <LoanHistoryCard
                    key={loan.id}
                    id={loan.id}
                    clientName={loan.nome_cliente}
                    clientEmail={loan.email_cliente}
                    loanDate={loan.data_locacao}
                    expectedReturnDate={loan.data_prevista_devolucao}
                    status={loan.status}
                    onSendReminder={handleSendReminder}
                    onReturn={handleReturn}
                    reminderLoading={reminderLoadingId === loan.id}
                    returnLoading={returnLoadingId === loan.id}
                  />
                ))
              ) : (
                // Message displayed when no loan history exists
                <p style={styles.noHistory}>
                  Nenhum empréstimo registrado para este livro.
                </p>
              )}
            </div>
          </div>
        ) : (
          // Error message if the book data could not be loaded
          <div style={styles.centerMessage}>
            Não foi possível carregar os detalhes do livro selecionado.
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  // Dark background overlay
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  // Main modal container styling
  modalBox: {
    background: "#fff",
    borderRadius: "12px",
    width: "760px",
    maxWidth: "95%",
    maxHeight: "90vh",
    overflowY: "auto" as const,
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },

  // Modal header layout
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    borderBottom: "1px solid #f1f5f9",
  },

  // Modal title styling
  modalTitle: {
    fontSize: "20px",
    fontWeight: "bold" as const,
    color: "#0f172a",
  },

  // Close button styling
  closeX: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#64748b",
  },

  // Modal content spacing
  modalContent: { padding: "32px" },

  // Centered message styling
  centerMessage: {
    padding: "48px",
    textAlign: "center" as const,
    color: "#64748b",
    fontSize: "16px",
  },

  // Container for book details section
  bookDetailsContainer: {
    display: "flex",
    gap: "32px",
    marginBottom: "32px",
  },

  // Book cover container
  coverBox: {
    width: "150px",
    height: "210px",
    background: "#f8fafc",
    borderRadius: "8px",
    overflow: "hidden",
  },

  // Book cover image styling
  coverImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
  },

  // Book information area
  infoBox: { flex: 1 },

  // Book title styling
  bookTitle: {
    fontSize: "22px",
    fontWeight: "bold" as const,
    color: "#0f172a",
    margin: "0 0 4px 0",
  },

  // Book author styling
  bookAuthor: {
    fontSize: "15px",
    color: "#64748b",
    margin: "0 0 24px 0",
  },

  // Grid for book metadata
  detailsGrid: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-start",
    width: "100%",
  },

  // Label styling
  label: {
    fontSize: "13px",
    color: "#94a3b8",
    display: "block",
    marginBottom: "2px",
  },

  // Value styling
  value: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#334155",
    margin: 0,
  },

  // Loan history title styling
  historyTitle: {
    fontSize: "18px",
    fontWeight: "bold" as const,
    color: "#0f172a",
    marginBottom: "20px",
    marginTop: "12px",
  },

  // Loan history container layout
  historyContainer: {
    display: "flex",
    flexDirection: "column" as const,
  },

  // Message displayed when there is no history
  noHistory: {
    color: "#94a3b8",
    fontStyle: "italic" as const,
    fontSize: "14px",
    marginTop: "4px",
  },

  itemContainer: {
    width: "48%",
  },

  historyListContainer: {
    maxHeight: "320px",
    overflowY: "auto" as const,
    scrollbarWidth: "none" as const,
    msOverflowStyle: "none",
  },
};