"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { FormEvent } from "react";

export interface FormDataProps {
  titulo: string;
  autor: string;
  isbn: string;
  editora: string;
  ano: number;
  quantidade: number;
  categoria: string;
}

export default function RegisterNewBook() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const newErrors: Record<string, string> = {};

    if (!data.titulo) newErrors.titulo = "*Este é um campo obrigatório.";
    if (!data.autor) newErrors.autor = "*Este é um campo obrigatório.";

    const isbnRegex = /^(\d{10}|\d{13})$/;
    if (!data.isbn) {
      newErrors.isbn = "*Este é um campo obrigatório.";
    } else if (!isbnRegex.test(data.isbn as string)) {
      newErrors.isbn = "*O ISBN deve ter 10 ou 13 dígitos.";
    }

    if (!data.editora) newErrors.editora = "*Este é um campo obrigatório.";
    if (!data.ano) newErrors.ano = "*Este é um campo obrigatório.";
    if (!data.quantidade)
      newErrors.quantidade = "*Este é um campo obrigatório.";
    if (!data.categoria) newErrors.categoria = "*Este é um campo obrigatório.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log("Dados do formulário:", data);
  }

  const categorias = [
    "Romance",
    "Tecnologia",
    "História",
    "Ciências",
    "Infantil",
  ];

  const inputClass =
    "mt-1 block w-full rounded-md border border-slate-300 px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#00C389] focus:outline-none focus:ring-1 focus:ring-[#00C389]";
  const labelClass = "text-sm font-medium text-slate-900";

  return (
    <div className="min-h-screen bg-[#F7F9FA] w-full overflow-x-hidden">
      <main className="mx-auto max-w-[896px] pt-[20px] px-6 pb-10">
        <header className="mb-[20px]">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
            Cadastrar Novo Livro
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-500">
            Adicione um novo livro ao acervo
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-[32px] rounded-lg border border-slate-200 bg-white pt-[32px] pb-8 px-6 shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px]">
            <div>
              <label htmlFor="titulo" className={labelClass}>
                Título
              </label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                className={inputClass}
                placeholder="Digite o título do livro"
              />
              {errors.titulo && (
                <p className="text-xs text-red-500 mt-1">{errors.titulo}</p>
              )}
            </div>

            <div>
              <label htmlFor="autor" className={labelClass}>
                Autor
              </label>
              <input
                type="text"
                id="autor"
                name="autor"
                className={inputClass}
                placeholder="Digite o nome do autor"
              />
              {errors.autor && (
                <p className="text-xs text-red-500 mt-1">{errors.autor}</p>
              )}
            </div>

            <div>
              <label htmlFor="isbn" className={labelClass}>
                ISBN
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                className={inputClass}
                placeholder="Digite o ISBN"
              />
              {errors.isbn && (
                <p className="text-xs text-red-500 mt-1">{errors.isbn}</p>
              )}
            </div>

            <div>
              <label htmlFor="editora" className={labelClass}>
                Editora
              </label>
              <input
                type="text"
                id="editora"
                name="editora"
                className={inputClass}
                placeholder="Digite a editora"
              />
              {errors.editora && (
                <p className="text-xs text-red-500 mt-1">{errors.editora}</p>
              )}
            </div>

            <div>
              <label htmlFor="ano" className={labelClass}>
                Ano
              </label>
              <input
                type="number"
                id="ano"
                name="ano"
                className={inputClass}
                placeholder="Digite o ano"
              />
              {errors.ano && (
                <p className="text-xs text-red-500 mt-1">{errors.ano}</p>
              )}
            </div>

            <div>
              <label htmlFor="quantidade" className={labelClass}>
                Quantidade
              </label>
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                className={inputClass}
                placeholder="Digite a quantidade"
              />
              {errors.quantidade && (
                <p className="text-xs text-red-500 mt-1">{errors.quantidade}</p>
              )}
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <p className={`${labelClass} mb-3`}>Categoria</p>
            <div className="flex w-full flex-wrap justify-center gap-4 xl:flex-nowrap xl:justify-between">
              {categorias.map((cat) => (
                <label key={cat} className="cursor-pointer">
                  <input
                    type="radio"
                    name="categoria"
                    value={cat.toLowerCase()}
                    className="peer sr-only"
                  />
                  <div className="flex w-[146.88px] h-[174.86px] flex-col items-center justify-end rounded-[8px] border-[1.67px] border-slate-200 bg-white px-[17.66px] pt-[17.66px] pb-[1.67px] text-sm text-slate-500 transition-all hover:bg-slate-50 peer-checked:border-[#00C389] peer-checked:bg-[#E6F9F0] peer-checked:font-medium peer-checked:text-[#00C389] gap-[8px]">
                    {cat}
                  </div>
                </label>
              ))}
            </div>
            {errors.categoria && (
              <p className="text-xs text-red-500 mt-2">{errors.categoria}</p>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-4 border-t border-slate-100 pt-6">
            <Button
              type="button"
              text="Cancelar"
              variantColor="bg-transparent text-[#00C389] border border-[#00C389]"
            />
            <Button
              type="submit"
              text="Salvar Livro"
              variantColor="bg-[#00C389] text-white hover:bg-[#00b07d]"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
