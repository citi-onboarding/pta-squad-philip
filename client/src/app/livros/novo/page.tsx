"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { FormEvent, ChangeEvent } from "react";
import api from "@/services/api";

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

    if (!data.titulo) newErrors.titulo = "*Este é um campo obrigatório.";
    if (!data.autor) newErrors.autor = "*Este é um campo obrigatório.";

    const isbnRegex = /^(\d{10}|\d{13})$/;
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
      await api.post("/livros", {
        titulo: data.titulo,
        autor: data.autor,
        isbn: data.isbn,
        editora: data.editora,
        ano: Number(data.ano),
        quantidade_total: Number(data.quantidade),
        categoria: (data.categoria as string)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
      });

      router.push("/livros");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar livro.");
    }
  }

  const categorias = [
    "Romance",
    "Tecnologia",
    "História",
    "Ciências",
    "Infantil",
  ];

  const capas: Record<string, string> = {
    Romance: "/Capas de Livros/Romance.png",
    Tecnologia: "/Capas de Livros/Tecnologia.png",
    Historia: "/Capas de Livros/Historia.png",
    Ciencias: "/Capas de Livros/Ciencias.png",
    Infantil: "/Capas de Livros/Infantil.png",
  };

  const inputClass =
    "mt-1 block w-full rounded-md border border-slate-300 px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#00C389] focus:outline-none focus:ring-1 focus:ring-[#00C389]";
  const labelClass = "text-sm font-medium text-slate-900";

  return (
    <div className="min-h-screen bg-[#F7F9FA] w-full overflow-x-hidden">
      <main className="mx-auto max-w-[896px] pt-[32px] px-6 pb-10">
        <header className="mb-[32px]">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800">
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                    value={cat}
                    className="peer sr-only"
                    onChange={handleChange}
                  />
                  <div className="flex w-[146.88px] h-[174.86px] flex-col items-center justify-end rounded-[8px] border-[1.67px] border-slate-200 bg-white px-[17.66px] pt-[17.66px] pb-[1.67px] text-sm text-slate-500 transition-all hover:bg-slate-50 peer-checked:border-[#00C389] peer-checked:bg-[#E6F9F0] peer-checked:font-medium peer-checked:text-[#00C389] gap-[8px]">
                    <img
                      src={
                        capas[
                          cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                        ]
                      }
                      alt={cat}
                      className="h-[140px] object-contain"
                    />

                    <span>{cat}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.categoria && (
              <p className="text-xs text-red-500 mt-2">{errors.categoria}</p>
            )}
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:justify-end gap-4 border-t border-slate-100 pt-6">
            <Button
              type="button"
              text="Cancelar"
              variantColor="bg-transparent text-[#00C389] border border-[#00C389]"
              className="w-full md:w-fit"
              onClick={() => router.push("/livros")}
            />
            <Button
              type="submit"
              text="Salvar Livro"
              variantColor="bg-[#00C389] text-white hover:bg-[#00b07d]"
              className="w-full md:w-fit"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
