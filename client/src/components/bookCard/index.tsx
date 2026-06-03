"use client";

import { Eye, Bookmark, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  title: string;
  author: string;
  category: string;
  availableQuantity: number;
  imageUrl?: string;
  onView?: () => void;
  onBorrow?: () => void;
  onDelete?: () => void;
}

export function BookCard({
  title,
  author,
  category,
  availableQuantity,
  imageUrl,
  onView,
  onBorrow,
  onDelete,
}: BookCardProps) {
  return (
    <article className="flex min-h-[410px] w-full flex-col rounded-md border border-slate-200 bg-white p-4 shadow-md">
      <div className="mb-4 aspect-[345/256] w-full overflow-hidden rounded bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Capa do livro ${title}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Sem imagem
          </div>
        )}
      </div>

      <div className="mb-5">
        <h3 className="mb-2 text-base font-semibold text-slate-900">{title}</h3>

        <p className="mb-2 text-sm text-slate-500">{author}</p>

        <p className="mb-2 text-xs font-medium text-emerald-500">{category}</p>

        <p className="text-xs font-medium text-slate-800">
          Disponível: {availableQuantity} unidade(s)
        </p>
      </div>

      <div className="mt-auto flex gap-2">
        <Button
          text="Ver"
          icon={<Eye size={14} strokeWidth={2} />}
          iconPosition="left"
          onClick={onView}
          variantColor="border border-[#00C389] text-[#00C389] hover:bg-[#00C389]/10"
          className="flex-1 text-sm font-medium"
        />

        <Button
          text="Emprestar"
          icon={<Bookmark size={14} strokeWidth={2} />}
          iconPosition="left"
          onClick={onBorrow}
          variantColor="bg-[#00C389] text-white hover:bg-[#00b07d]"
          className="flex-1 text-sm disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300"
          disabled={availableQuantity === 0}
        />

        <Button
          icon={<Trash2 size={14} strokeWidth={2} />}
          onClick={onDelete}
          aria-label="Excluir livro"
          variantColor="bg-red-500 text-white hover:bg-red-600"
          customSize="w-11"
        />
      </div>
    </article>
  );
}
