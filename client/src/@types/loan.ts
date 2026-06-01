export type LoanStatus = "Em_andamento" | "Devolvido" | "Atrasado"

export interface Loan {
  id: string
  livro_id: string
  nome_cliente: string
  email_cliente: string
  data_locacao: string
  data_prevista_devolucao: string
  data_devolucao_real: string | null
  data_lembrete_preventivo_enviado: string | null
  data_ultimo_lembrete_atraso: string | null
  status: LoanStatus
}