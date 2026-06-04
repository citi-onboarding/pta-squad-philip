"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { FormEvent, ChangeEvent } from "react";
import { createBook } from "@/services/books.service";
import { categoryImageMap } from "@/lib/categoryMap";
import {
  primaryActionButton,
  secondaryActionButton,
  interactiveCard,
} from "@/lib/animations";

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
  const router = useRouter();

  function validateField(fieldName: string, value: string) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      const isbnRegex = /^(\d{10}|\d{13})$/;

      switch (fieldName) {
        case "titulo":
          value
            ? delete newErrors.titulo
            : (newErrors.titulo = "*Este é um campo obrigatório.");
          break;

        case "autor":
          value
            ? delete newErrors.autor
            : (newErrors.autor = "*Este é um campo obrigatório.");
          break;

        case "isbn":
          if (!value) newErrors.isbn = "*Este é um campo obrigatório.";
          else if (!isbnRegex.test(value))
            newErrors.isbn = "*O ISBN deve ter 10 ou 13 dígitos.";
          else delete newErrors.isbn;
          break;

        case "editora":
          value
            ? delete newErrors.editora
            : (newErrors.editora = "*Este é um campo obrigatório.");
          break;

        case "ano":
          if (!value) newErrors.ano = "*Este é um campo obrigatório.";
          else if (
            Number(value) < 1 ||
            Number(value) > new Date().getFullYear()
          )
            newErrors.ano = `*O ano deve ser entre 1 e ${new Date().getFullYear()}.`;
          else delete newErrors.ano;
          break;

        case "quantidade":
          if (!value) newErrors.quantidade = "*Este é um campo obrigatório.";
          else if (Number(value) < 1)
            newErrors.quantidade = "*A quantidade deve ser maior que zero.";
          else delete newErrors.quantidade;
          break;

        case "categoria":
          value
            ? delete newErrors.categoria
            : (newErrors.categoria = "*Este é um campo obrigatório.");
          break;
      }

      return newErrors;
    });
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    validateField(e.target.name, e.target.value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const newErrors: Record<string, string> = {};
    const isbnRegex = /^(\d{10}|\d{13})$/;

    if (!data.titulo) newErrors.titulo = "*Este é um campo obrigatório.";
    if (!data.autor) newErrors.autor = "*Este é um campo obrigatório.";

    if (!data.isbn) {
      newErrors.isbn = "*Este é um campo obrigatório.";
    } else if (!isbnRegex.test(data.isbn as string)) {
      newErrors.isbn = "*O ISBN deve ter 10 ou 13 dígitos.";
    }

    if (!data.editora) newErrors.editora = "*Este é um campo obrigatório.";

    if (!data.ano) {
      newErrors.ano = "*Este é um campo obrigatório.";
    } else if (
      Number(data.ano) < 1 ||
      Number(data.ano) > new Date().getFullYear()
    ) {
      newErrors.ano = `*O ano deve ser entre 1 e ${new Date().getFullYear()}.`;
    }

    if (!data.quantidade) {
      newErrors.quantidade = "*Este é um campo obrigatório.";
    } else if (Number(data.quantidade) < 1) {
      newErrors.quantidade = "*A quantidade deve ser maior que zero.";
    }

    if (!data.categoria) newErrors.categoria = "*Este é um campo obrigatório.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await createBook({
        titulo: data.titulo as string,
        autor: data.autor as string,
        isbn: data.isbn as string,
        editora: data.editora as string,
        ano: Number(data.ano),
        quantidade_total: Number(data.quantidade),
        categoria: (data.categoria as string)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
      });

      router.push("/livros");
    } catch (error) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || "Erro ao cadastrar livro.";

        setErrors((prev) => ({
          ...prev,
          isbn: `*${message}`,
        }));

        return;
      }

      setErrors((prev) => ({
        ...prev,
        isbn: "*Erro inesperado ao cadastrar livro.",
      }));
    }
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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F7F9FA]">
      <main className="mx-auto max-w-[896px] px-6 pb-10 pt-[32px]">
        <header className="mb-[32px]">
          <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">
            Cadastrar Novo Livro
          </h2>

          <p className="mt-2 text-sm text-slate-500 md:text-base">
            Adicione um novo livro ao acervo
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-[16px] rounded-lg border border-slate-200 bg-white px-6 pb-8 pt-[32px] shadow-md"
        >
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 md:gap-[32px]">
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
                onChange={handleChange}
              />

              <p className="mt-1 min-h-[16px] text-xs text-red-500">
                {errors.titulo}
              </p>
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
                onChange={handleChange}
              />

              <p className="mt-1 min-h-[16px] text-xs text-red-500">
                {errors.autor}
              </p>
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
                onChange={handleChange}
              />

              <p className="mt-1 min-h-[16px] text-xs text-red-500">
                {errors.isbn}
              </p>
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
                onChange={handleChange}
              />

              <p className="mt-1 min-h-[16px] text-xs text-red-500">
                {errors.editora}
              </p>
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
                onChange={handleChange}
              />

              <p className="mt-1 min-h-[16px] text-xs text-red-500">
                {errors.ano}
              </p>
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
                onChange={handleChange}
              />

              <p className="mt-1 min-h-[16px] text-xs text-red-500">
                {errors.quantidade}
              </p>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <p className={`${labelClass} mb-3`}>Categoria</p>

            <div className="flex w-full flex-wrap justify-center gap-4 xl:flex-nowrap xl:justify-between">
              {categorias.map((cat) => {
                const categoryKey = cat
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "");

                return (
                  <label key={cat} className="cursor-pointer">
                    <input
                      type="radio"
                      name="categoria"
                      value={cat}
                      className="peer sr-only"
                      onChange={handleChange}
                    />

                    <div
                      className={`relative h-[174.86px] w-[146.88px] overflow-hidden rounded-[8px] border-[1.67px] border-slate-200 bg-white transition-all hover:border-slate-300 peer-checked:border-[#00C389] peer-checked:ring-2 peer-checked:ring-[#00C389]/20 ${interactiveCard}`}
                    >
                      <img
                        src={categoryImageMap[categoryKey]}
                        alt={cat}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </label>
                );
              })}
            </div>

            <p className="mt-1 min-h-[16px] text-xs text-red-500">
              {errors.categoria}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-6 md:flex-row md:justify-end">
            <Button
              type="button"
              text="Cancelar"
              variantColor="bg-transparent text-[#00C389] border border-[#00C389]"
              className={`w-full md:w-fit ${secondaryActionButton}`}
              onClick={() => router.push("/livros")}
            />

            <Button
              type="submit"
              text="Salvar Livro"
              variantColor="bg-[#00C389] text-white hover:bg-[#00b07d]"
              className={`w-full md:w-fit ${primaryActionButton}`}
            />
          </div>
        </form>
      </main>
    </div>
  );
}
