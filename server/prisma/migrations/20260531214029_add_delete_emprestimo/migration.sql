-- DropForeignKey
ALTER TABLE "Emprestimo" DROP CONSTRAINT "Emprestimo_livro_id_fkey";

-- AddForeignKey
ALTER TABLE "Emprestimo" ADD CONSTRAINT "Emprestimo_livro_id_fkey" FOREIGN KEY ("livro_id") REFERENCES "Livro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
