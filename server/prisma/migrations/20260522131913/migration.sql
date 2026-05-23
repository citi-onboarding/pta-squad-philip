-- AlterTable
ALTER TABLE "Emprestimo" ADD COLUMN     "data_lembrete_preventivo_enviado" TIMESTAMP(3),
ADD COLUMN     "data_ultimo_lembrete_atraso" TIMESTAMP(3);
