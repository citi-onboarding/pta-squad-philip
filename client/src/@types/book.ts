export type Category = "Romance" | "Infantil" | "Tecnologia" | "Historia" | "Ciencias"

export interface Book {
  id: string
  titulo: string
  autor: string
  isbn: string
  editora: string
  ano: number
  quantidade_total: number
  quantidade_disponivel: number
  categoria: Category
}