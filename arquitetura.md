# Arquitetura do Projeto

## Frontend (Client)

```text
client
ÃÄÄ public
³   ÃÄÄ Capas de Livros
³   ÀÄÄ img
ÃÄÄ src
³   ÃÄÄ @types
³   ÃÄÄ app
³   ³   ÀÄÄ livros
³   ³       ÀÄÄ novo
³   ÃÄÄ assets
³   ³   ÀÄÄ icons
³   ÃÄÄ components
³   ³   ÃÄÄ bagde
³   ³   ÃÄÄ bookCard
³   ³   ÃÄÄ BookDetailModal
³   ³   ÃÄÄ bookFilters
³   ³   ÃÄÄ categoryChart
³   ³   ÃÄÄ header
³   ³   ÃÄÄ loanModal
³   ³   ÃÄÄ statCard
³   ³   ÀÄÄ ui
³   ³       ÀÄÄ button
³   ÃÄÄ hooks
³   ÃÄÄ lib
³   ÃÄÄ services
³   ÀÄÄ styles
ÀÄÄ tests
```

## Mobile

```text
mobile
ÃÄÄ .expo-shared
ÃÄÄ .github
ÃÄÄ app
ÀÄÄ src
    ÃÄÄ assets
    ³   ÃÄÄ capasLivros
    ³   ÀÄÄ icons
    ÃÄÄ components
    ³   ÃÄÄ LoanCard
    ³   ÃÄÄ MobileHeader
    ³   ÃÄÄ SearchButton
    ³   ÀÄÄ SearchInput
    ÃÄÄ services
    ÀÄÄ styles
```

## Backend (Server)

```text
server
ÃÄÄ prisma
³   ÀÄÄ migrations
³       ÃÄÄ 20260513230327_create_library_schema
³       ÃÄÄ 20260517173924_add_unique_to_isbn
³       ÃÄÄ 20260522125117_add_data_devolucao_real
³       ÃÄÄ 20260522131913
³       ÀÄÄ 20260531214029_add_delete_emprestimo
ÃÄÄ src
³   ÃÄÄ assets
³   ³   ÀÄÄ icons
³   ÃÄÄ controllers
³   ÃÄÄ database
³   ÃÄÄ dtos
³   ³   ÃÄÄ book
³   ³   ÃÄÄ dashboard
³   ³   ÀÄÄ loan
³   ÃÄÄ errors
³   ÃÄÄ jobs
³   ÃÄÄ middlewares
³   ÃÄÄ repositories
³   ÃÄÄ routes
³   ÃÄÄ services
³   ³   ÃÄÄ book
³   ³   ÃÄÄ dashboard
³   ³   ÀÄÄ loan
³   ÃÄÄ utils
³   ÀÄÄ server.ts
ÀÄÄ tests
    ÃÄÄ backendTests
    ÀÄÄ integrationTests
```
