import { Categoria } from "../../../generated/prisma";

export interface CreateBookDTO {
    titulo: string;
    autor: string;
    isbn: string;
    editora: string;
    ano: number;
    quantidade_total: number;
    categoria: Categoria; 
}