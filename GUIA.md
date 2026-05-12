# Guia do Projeto — Squad Philip

## Estrutura de Pastas

### Server
```
server/
├── prisma/
│   ├── migrations/                 # Histórico de migrations (gerado automaticamente, não mexa)
│   └── schema.prisma               # Modelos do banco de dados
├── src/
│   ├── controllers/                # Recebe a requisição, aplica regras de negócio e devolve a resposta
│   ├── global/                     # Abstração Citi — leia a seção abaixo
│   ├── routes/                     # Define as rotas e conecta cada uma ao seu controller
│   │   ├── index.ts                # Agrega todas as rotas
│   │   ├── livro.routes.ts
│   │   └── emprestimo.routes.ts
│   ├── database/
│   │   └──index.ts                 # Instância do Prisma Client — não mexa
│   └── server.ts                   # Entry point — não mexa
└── prisma.config.ts                # Configuração do Prisma 7 — não mexa
```

### Client
```
src/
├── app/                            # Páginas da aplicação (Next.js App Router)
├── assets/                         # Imagens e ícones
├── components/                     # Componentes React reutilizáveis
│   └── ui/                         # Componentes base do Shadcn UI
├── lib/                            # Função utilitária cn() do Tailwind
└── services/
└── api.ts                          # Instância do Axios configurada para o backend
```

### Mobile
```
src/
├── app/                            # Telas da aplicação (Expo Router)
├── assets/                         # Imagens e ícones
├── components/                     # Componentes React Native reutilizáveis
└── styles/                         # Tema e estilos globais
```
---

## A Abstração Citi

Esse projeto não usa service nem repository como camadas separadas. No lugar, existe a classe `Citi` que já encapsula todas as operações do banco de dados.

O fluxo é:
Request → Controller → Citi → Banco → Response

A lógica de negócio fica no controller. As queries ficam na `Citi`.

A classe oferece os seguintes métodos: `insertIntoDatabase`, `getAll`, `findById`, `updateValue`, `deleteValue` e `areValuesUndefined`. Todos estão documentados no `README.md`.

---

## Dúvidas?
Entre em contato com o gerente!