import { useState } from "react"
import { getBookById, BookDetails } from "@/services/books.service"
import { sendLoanReminder, returnLoan } from "@/services/loans.service"

export const useBookDetails = () => {
  const [book, setBook] = useState<BookDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [reminderLoadingId, setReminderLoadingId] = useState<string | null>(null)
  const [returnLoadingId, setReturnLoadingId] = useState<string | null>(null)

  const fetchBook = async (id: string) => {
    setLoading(true)
    try {
      const data = await getBookById(id)
      setBook(data)
    } catch (error) {
      console.error("Erro ao buscar detalhes do livro:", error)
      alert("Erro ao carregar detalhes do livro.")
    } finally {
      setLoading(false)
    }
  }

  const sendReminder = async (loanId: string) => {
    setReminderLoadingId(loanId)
    try {
      await sendLoanReminder(loanId)
      alert("E-mail de lembrete enviado com sucesso.")
    } catch (error) {
      console.error("Erro ao enviar lembrete:", error)
      alert("Falha ao enviar o e-mail de lembrete.")
    } finally {
      setReminderLoadingId(null)
    }
  }

  const returnBook = async (loanId: string, onSuccess?: () => void) => {
    setReturnLoadingId(loanId)
    try {
      await returnLoan(loanId)
      alert("Livro marcado como devolvido com sucesso.")
      if (book) await fetchBook(book.id)
      onSuccess?.()
    } catch (error) {
      console.error("Erro ao marcar como devolvido:", error)
      alert("Falha ao marcar o livro como devolvido.")
    } finally {
      setReturnLoadingId(null)
    }
  }

  return {
    book,
    loading,
    reminderLoadingId,
    returnLoadingId,
    fetchBook,
    sendReminder,
    returnBook,
  }
}