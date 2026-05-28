export interface CreateEmprestimoDTO {
  livro_id: string;
  nome_cliente: string;
  email_cliente: string;
  data_locacao: string | Date;
  data_prevista_devolucao: string | Date;
}
