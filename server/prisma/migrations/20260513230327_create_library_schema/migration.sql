-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('Romance', 'Infantil', 'Tecnologia', 'Historia', 'Ciencias');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Em_andamento', 'Devolvido', 'Atrasado');

-- CreateTable
CREATE TABLE "Livro" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "editora" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "quantidade_total" INTEGER NOT NULL,
    "quantidade_disponivel" INTEGER NOT NULL,
    "categoria" "Categoria" NOT NULL,

    CONSTRAINT "Livro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emprestimo" (
    "id" TEXT NOT NULL,
    "livro_id" TEXT NOT NULL,
    "nome_cliente" TEXT NOT NULL,
    "email_cliente" TEXT NOT NULL,
    "data_locacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_prevista_devolucao" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Em_andamento',

    CONSTRAINT "Emprestimo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Emprestimo" ADD CONSTRAINT "Emprestimo_livro_id_fkey" FOREIGN KEY ("livro_id") REFERENCES "Livro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
