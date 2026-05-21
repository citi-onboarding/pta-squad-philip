'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import { useIsMobile } from "../../hooks/use-mobile";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { Field, FieldLabel, FieldError } from "../ui/field";
import { useState } from "react";
import { Separator } from "../ui/separator";

interface LoanFormData {
  clientName: string
  clientEmail: string
  loanDate: string
  returnDate: string
}

interface LoanFormErrors {
  clientName?: string
  clientEmail?: string
  loanDate?: string
  returnDate?: string
}

interface LoanModalProps {
  open: boolean
  onOpenChange: (isOpen: boolean) => void
  bookTitle: string
}

export function LoanModal({ open, onOpenChange, bookTitle }: LoanModalProps) {
  
  const [formData, setFormData] = useState<LoanFormData>({
    clientName: "",
    clientEmail: "",
    loanDate: "",
    returnDate: "", 
  })

  const [errors, setErrors] = useState<LoanFormErrors>({})

  const isMobile = useIsMobile() 
  
  const validateField = (name: keyof LoanFormData, value: string) => {
    const updatedData = { ...formData, [name]: value }
    const newErrors = { ...errors }

    switch (name) {
      case "clientName":
        if (!value) newErrors.clientName = "Nome é obrigatório"
        else delete newErrors.clientName
        break

      case "clientEmail":
        if (!value) newErrors.clientEmail = "Email é obrigatório"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.clientEmail = "Email inválido"
        else delete newErrors.clientEmail
        break

      case "loanDate":
        if (!value) newErrors.loanDate = "Data de locação é obrigatória"
        else delete newErrors.loanDate

        if (!updatedData.returnDate)
          newErrors.returnDate = "Data de devolução é obrigatória"
        else if (updatedData.returnDate < value)
          newErrors.returnDate = "Data de devolução não pode ser anterior à de locação"
        else delete newErrors.returnDate
        break

      case "returnDate":
        if (!value) newErrors.returnDate = "Data de devolução é obrigatória"
        else if (value < updatedData.loanDate)
          newErrors.returnDate = "Data de devolução não pode ser anterior à de locação"
        else delete newErrors.returnDate
        break
    }

    setErrors(newErrors)
  }

  const submitLoan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors: LoanFormErrors = {}

    if (!formData.clientName)
      newErrors.clientName = "Nome é obrigatório"

    if (!formData.clientEmail)
      newErrors.clientEmail = "Email é obrigatório"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail))
      newErrors.clientEmail = "Email inválido"

    if (!formData.loanDate)
      newErrors.loanDate = "Data de locação é obrigatória"

    if (!formData.returnDate)
      newErrors.returnDate = "Data de devolução é obrigatória"
    else if (formData.returnDate < formData.loanDate)
      newErrors.returnDate = "Data de devolução não pode ser anterior à de locação"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({ clientName: "", clientEmail: "", loanDate: "", returnDate: "" })
    setErrors({})
    onOpenChange(false)
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent>
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle className="text-2xl">Realizar empréstimo</DrawerTitle>
            <DrawerClose onClick={handleClose} className="p-2 hover:bg-[#f0f0f0] hover:duration-200 rounded-lg">
              <X className="w-5 h-5 text-[#717182]" />
            </DrawerClose>
          </DrawerHeader>
          <Separator />
          <div className="px-4 flex flex-col gap-4 overflow-y-auto">
            <div className="bg-[#F7F9FA] flex flex-col items-start justify-center p-6 rounded-lg mt-4">
              <p className="text-[#717182] text-sm">Livro selecionado:</p>
              <span className="text-[#1E1E1E] text-md">{bookTitle}</span>
            </div>

            <form onSubmit={submitLoan} className="flex flex-col gap-4">
              <Field>
                <FieldLabel>Nome do Cliente</FieldLabel>
                <Input
                  className="h-12"
                  type="text"
                  placeholder="Digite o nome do cliente"
                  value={formData.clientName}
                  onChange={(e) => {
                    setFormData({ ...formData, clientName: e.target.value })
                    validateField("clientName", e.target.value)
                  }}
                />
                <FieldError>{errors.clientName}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Email do Cliente</FieldLabel>
                <Input
                  className="h-12"
                  type="text"
                  placeholder="Digite o email do cliente"
                  value={formData.clientEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, clientEmail: e.target.value })
                    validateField("clientEmail", e.target.value)
                  }}
                />
                <FieldError>{errors.clientEmail}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Data da Locação</FieldLabel>
                <Input
                  className="h-12 text-[#9CA3AF]"
                  type="date"
                  value={formData.loanDate}
                  onChange={(e) => {
                    setFormData({ ...formData, loanDate: e.target.value })
                    validateField("loanDate", e.target.value)
                  }}
                />
                <FieldError>{errors.loanDate}</FieldError>
              </Field>

              <Field>
                <FieldLabel>Data da Devolução</FieldLabel>
                <Input
                  className="h-12 text-[#9CA3AF]"
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => {
                    setFormData({ ...formData, returnDate: e.target.value })
                    validateField("returnDate", e.target.value)
                  }}
                />
                <FieldError>{errors.returnDate}</FieldError>
              </Field>

              <Separator />
              <div className="flex w-full justify-center items-center gap-2 pb-4">
                <Button onClick={handleClose} type="button" className="bg-white border border-solid border-[#00C389] rounded-lg text-[#00C389] text-lg">Cancelar</Button>
                <Button type="submit" className="bg-[#00C389] border border-solid rounded-lg text-white text-lg">Confirmar Empréstimo</Button>
              </div>
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="backdrop-blur-sm bg-black/20" />
      <DialogContent className="max-w-[393px] [&>button]:hidden">
        <DialogHeader className="flex justify-between">
          <DialogTitle className="text-2xl flex justify-between">Realizar empréstimo
            <DialogClose className="p-2 hover:bg-[#f0f0f0] hover:duration-200 rounded-lg">
              <X className="w-5 h-5 text-[#717182]" />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="bg-[#F7F9FA] flex flex-col items-start justify-center p-6 rounded-lg mb-2">
          <p className="text-[#717182] text-sm">Livro selecionado:</p>
          <span className="text-[#1E1E1E] text-md">{bookTitle}</span>
        </div>

        <form onSubmit={submitLoan} className="flex flex-col gap-4">
          <Field>
            <FieldLabel>Nome do Cliente</FieldLabel>
            <Input
              className="h-12"
              type="text"
              placeholder="Digite o nome do cliente"
              value={formData.clientName}
              onChange={(e) => {
                setFormData({ ...formData, clientName: e.target.value })
                validateField("clientName", e.target.value)
              }}
            />
            <FieldError>{errors.clientName}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Email do Cliente</FieldLabel>
            <Input
              className="h-12"
              type="text"
              placeholder="Digite o email do cliente"
              value={formData.clientEmail}
              onChange={(e) => {
                setFormData({ ...formData, clientEmail: e.target.value })
                validateField("clientEmail", e.target.value)
              }}
            />
            <FieldError>{errors.clientEmail}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Data da Locação</FieldLabel>
            <Input
              className="h-12 text-[#9CA3AF] [&:not(:focus):not([value])]:text-[#9CA3AF]"
              type="date"
              value={formData.loanDate}
              onChange={(e) => {
                setFormData({ ...formData, loanDate: e.target.value })
                validateField("loanDate", e.target.value)
              }}
            />
            <FieldError>{errors.loanDate}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Data da Devolução</FieldLabel>
            <Input
              className="h-12 text-[#9CA3AF] [&:not(:focus):not([value])]:text-[#9CA3AF]"
              type="date"
              value={formData.returnDate}
              onChange={(e) => {
                setFormData({ ...formData, returnDate: e.target.value })
                validateField("returnDate", e.target.value)
              }}
            />
            <FieldError>{errors.returnDate}</FieldError>
          </Field>
          <Separator />
          <div className="flex w-full justify-center items-center gap-2">
            <Button onClick={handleClose} type="button" className="bg-white border border-solid border-[#00C389] rounded-lg text-[#00C389] text-lg">Cancelar</Button>
            <Button type="submit" className="bg-[#00C389] border border-solid rounded-lg text-white text-lg">Confirmar Empréstimo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}