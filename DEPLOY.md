# Guia de Deploy

## Infraestrutura

| Serviço | Plataforma | URL |
|---|---|---|
| Backend | Render | https://pta-squad-philip.onrender.com |
| Frontend | Vercel | https://pta-squad-philip.vercel.app |
| Banco de dados | Neon | https://console.neon.tech |

---

## Como funciona o deploy

O deploy é **automático** para o frontend e **automático** para o backend sempre que houver merge na branch `main` do repositório original (`citi-onboarding/pta-squad-philip`).

- **Render** monitora a branch `main` do repo original diretamente
- **Vercel** monitora a branch `main` do fork `philipsantiagoo/pta-squad-philip`

Por isso, toda vez que a `main` do repo original for atualizada, o **backend sobe automaticamente**, mas o **frontend precisa de um passo extra** — sincronizar o fork.

---

## Como atualizar o deploy

### Backend (automático)
Basta fazer merge na `main` do repo original. O Render detecta e redeploya automaticamente.

### Frontend (requer sincronização do fork)

1. Acessa o fork: [philipsantiagoo/pta-squad-philip](https://github.com/philipsantiagoo/pta-squad-philip)
2. Clica em **Sync fork** → **Update branch**
3. A Vercel detecta a atualização e redeploya automaticamente

---

## Como acessar os painéis

- **Render (backend):** [dashboard.render.com](https://dashboard.render.com) → projeto `pta-squad-philip`
- **Vercel (frontend):** [vercel.com](https://vercel.com) → projeto `pta-squad-philip`
- **Neon (banco):** [console.neon.tech](https://console.neon.tech) → projeto `pta-squad-philip`

---

## Variáveis de ambiente

### Backend (configuradas no Render)
| Variável | Descrição |
|---|---|
| `DATABASE_URL` | URL de conexão com o banco Neon |
| `SERVER_PORT` | Porta do servidor (3001) |
| `SMTP_HOST` | Host do servidor SMTP para e-mails |
| `SMTP_PORT` | Porta SMTP |
| `SMTP_USER` | E-mail remetente |
| `SMTP_PASS` | Senha de app do Gmail |

### Frontend (configuradas na Vercel)
| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL do backend no Render |

---

## Aplicar migrations no banco de produção

Sempre que houver alteração no `schema.prisma`, rode o comando abaixo para aplicar no banco de produção:

```bash
cd server
pnpm prisma migrate dev --url "URL_DO_NEON"
```

A URL do Neon está disponível no painel do [Neon Console](https://console.neon.tech) em **Connection string**.

---

## Observações importantes

- O plano gratuito do Render faz o servidor **dormir após 15 minutos de inatividade** — a primeira requisição pode demorar até 50 segundos para acordar
- O banco Neon também **escala para zero** no plano gratuito — a primeira conexão pode ser mais lenta
- Nunca commite o arquivo `.env` — ele contém credenciais sensíveis e já está no `.gitignore`