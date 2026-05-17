/*
  Warnings:

  - A unique constraint covering the columns `[isbn]` on the table `Livro` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Livro_isbn_key" ON "Livro"("isbn");
