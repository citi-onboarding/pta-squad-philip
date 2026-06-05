"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { useIsMobile } from "../../hooks/useMobile";
import { Input } from "../ui/input";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { Separator } from "../ui/separator";
import { primaryActionButton, secondaryActionButton } from "@/lib/animations";

interface LoanFormData {
  clientName: string;
  clientEmail: string;
  loanDate: string;
  returnDate: string;
}

interface LoanFormErrors {
  clientName?: string;
  clientEmail?: string;
  loanDate?: string;
  returnDate?: string;
}

interface LoanModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  bookTitle: string;
  apiError: string | null;
  onConfirm: (data: {
    clientName: string;
    clientEmail: string;
    loanDate: string;
    expectedReturnDate: string;
  }) => Promise<void>;
}

export function LoanModal({
  open,
  onOpenChange,
  bookTitle,
  apiError,
  onConfirm,
}: LoanModalProps) {
  const [formData, setFormData] = useState<LoanFormData>({
    clientName: "",
    clientEmail: "",
    loanDate: "",
    returnDate: "",
  });

  const [errors, setErrors] = useState<LoanFormErrors>({});

  const isMobile = useIsMobile();

  const validateField = (name: keyof LoanFormData, value: string) => {
    const updatedData = { ...formData, [name]: value };
    const newErrors = { ...errors };

    switch (name) {
      case "clientName":
        if (!value) newErrors.clientName = "Nome é obrigatório";
        else delete newErrors.clientName;
        break;

      case "clientEmail":
        if (!value) newErrors.clientEmail = "Email é obrigatório";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.clientEmail = "Email inválido";
        else delete newErrors.clientEmail;
        break;

      case "loanDate":
        if (!value) newErrors.loanDate = "Data de locação é obrigatória";
        else delete newErrors.loanDate;

        if (!updatedData.returnDate)
          newErrors.returnDate = "Data de devolução é obrigatória";
        else if (updatedData.returnDate < value)
          newErrors.returnDate =
            "Data de devolução não pode ser anterior à de locação";
        else delete newErrors.returnDate;
        break;

      case "returnDate":
        if (!value) newErrors.returnDate = "Data de devolução é obrigatória";
        else if (value < updatedData.loanDate)
          newErrors.returnDate =
            "Data de devolução não pode ser anterior à de locação";
        else delete newErrors.returnDate;
        break;
    }

    setErrors(newErrors);
  };

  const submitLoan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: LoanFormErrors = {};

    if (!formData.clientName) newErrors.clientName = "Nome é obrigatório";

    if (!formData.clientEmail) newErrors.clientEmail = "Email é obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail))
      newErrors.clientEmail = "Email inválido";

    if (!formData.loanDate)
      newErrors.loanDate = "Data de locação é obrigatória";

    if (!formData.returnDate)
      newErrors.returnDate = "Data de devolução é obrigatória";
    else if (formData.returnDate < formData.loanDate)
      newErrors.returnDate =
        "Data de devolução não pode ser anterior à de locação";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onConfirm({
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      expectedReturnDate: formData.returnDate,
      loanDate: formData.loanDate,
    });
  };

  const handleClose = () => {
    setFormData({
      clientName: "",
      clientEmail: "",
      loanDate: "",
      returnDate: "",
    });
    setErrors({});
    onOpenChange(false);
  };

  const formFields = (
    <>
      <Field>
        <FieldLabel>Nome do Cliente</FieldLabel>
        <Input
          className="h-12"
          type="text"
          placeholder="Digite o nome do cliente"
          value={formData.clientName}
          onChange={(e) => {
            setFormData({ ...formData, clientName: e.target.value });
            validateField("clientName", e.target.value);
          }}
        />
        <div className="min-h-[20px]">
          <FieldError>{errors.clientName}</FieldError>
        </div>
      </Field>

      <Field>
        <FieldLabel>Email do Cliente</FieldLabel>
        <Input
          className="h-12"
          type="text"
          placeholder="Digite o email do cliente"
          value={formData.clientEmail}
          onChange={(e) => {
            setFormData({ ...formData, clientEmail: e.target.value });
            validateField("clientEmail", e.target.value);
          }}
        />
        <div className="min-h-[20px]">
          <FieldError>{errors.clientEmail}</FieldError>
        </div>
      </Field>

      <Field>
        <FieldLabel>Data da Locação</FieldLabel>
        <Input
          className="h-12 text-[#9CA3AF]"
          type="date"
          value={formData.loanDate}
          onChange={(e) => {
            setFormData({ ...formData, loanDate: e.target.value });
            validateField("loanDate", e.target.value);
          }}
        />
        <div className="min-h-[20px]">
          <FieldError>{errors.loanDate}</FieldError>
        </div>
      </Field>

      <Field>
        <FieldLabel>Data da Devolução</FieldLabel>
        <Input
          className="h-12 text-[#9CA3AF]"
          type="date"
          value={formData.returnDate}
          onChange={(e) => {
            setFormData({ ...formData, returnDate: e.target.value });
            validateField("returnDate", e.target.value);
          }}
        />
        <div className="min-h-[20px]">
          <FieldError>{errors.returnDate}</FieldError>
        </div>
      </Field>

      {apiError && (
        <div className="w-full rounded border border-red-400 bg-red-100 px-4 py-2 text-sm font-medium text-red-700">
          {apiError}
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent className="flex max-h-[90dvh] flex-col overflow-hidden">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle className="text-2xl">Realizar empréstimo</DrawerTitle>

            <DrawerClose
              onClick={handleClose}
              className="rounded-lg p-2 hover:bg-[#f0f0f0] hover:duration-200"
            >
              <X className="h-5 w-5 text-[#717182]" />
            </DrawerClose>
          </DrawerHeader>

          <Separator />

          <form
            onSubmit={submitLoan}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="mt-4 flex flex-col items-start justify-center rounded-lg bg-[#F7F9FA] p-4">
                <p className="text-sm text-[#717182]">Livro selecionado:</p>
                <span className="text-md text-[#1E1E1E]">{bookTitle}</span>
              </div>

              <div className="mt-4 flex flex-col gap-2">{formFields}</div>
            </div>

            <div className="border-t bg-white px-4 py-4">
              <div className="flex w-full items-center justify-center gap-2">
                <Button
                  onClick={handleClose}
                  type="button"
                  className={`rounded-lg border border-solid border-[#00C389] bg-white text-base text-[#00C389] ${secondaryActionButton}`}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  className={`rounded-lg border border-solid bg-[#00C389] text-base text-white ${primaryActionButton}`}
                >
                  Confirmar Empréstimo
                </Button>
              </div>
            </div>
          </form>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-black/20 backdrop-blur-sm" />

      <DialogContent className="flex max-h-[90dvh] max-w-[393px] flex-col overflow-hidden [&>button]:hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex justify-between text-2xl">
            Realizar empréstimo
            <DialogClose className="rounded-lg p-2 hover:bg-[#f0f0f0] hover:duration-200">
              <X className="h-5 w-5 text-[#717182]" />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <Separator className="shrink-0" />

        <form
          onSubmit={submitLoan}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="mb-4 flex flex-col items-start justify-center rounded-lg bg-[#F7F9FA] p-6">
              <p className="text-sm text-[#717182]">Livro selecionado:</p>
              <span className="text-md text-[#1E1E1E]">{bookTitle}</span>
            </div>

            <div className="flex flex-col gap-2">{formFields}</div>
          </div>

          <div className="mt-4 shrink-0 border-t bg-white pt-4">
            <div className="flex w-full items-center justify-center gap-2">
              <Button
                onClick={handleClose}
                type="button"
                className={`border border-solid border-slate-200 bg-white text-black hover:border-[#00C389] hover:text-[#00C389] ${secondaryActionButton}`}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                className={`rounded-lg border border-solid bg-[#00C389] font-medium text-white hover:bg-[#00b07d] ${primaryActionButton}`}
              >
                Confirmar Empréstimo
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
