# 🚀 Guia de Deploy no Vercel

Este projeto usa **React (Vite)** no frontend e **Express (Node.js)** no backend. Para rodar no Vercel, precisamos de algumas configurações especiais, principalmente no Banco de Dados.

## 1. Banco de Dados (PostgreSQL)

O Vercel não suporta arquivos locais (SQLite). Você PRECISA migrar para um banco PostgreSQL.

### Passo a Passo:
1.  Crie uma conta gratuita no [Neon.tech](https://neon.tech) ou [Supabase](https://supabase.com).
2.  Crie um novo projeto "MusicHorizon".
3.  Copie a **Connection String** (ex: `postgres://user:pass@host/db...`).

### No Projeto:
1.  Edite `server/prisma/schema.prisma`:
    ```prisma
    datasource db {
      provider = "postgresql" // Mude de "sqlite" para "postgresql"
      url      = env("DATABASE_URL")
    }
    ```
2.  Edite `server/.env` (local) para testar:
    ```env
    DATABASE_URL="sua_string_postgres_aqui"
    ```
3.  Rode a migração (atenção: `tracks` deve ser `Json` no Postgres, mas nosso código usa string. Para manter compatibilidade rápida, mantenha `String` no schema ou ajuste para `Json` e remova o `JSON.stringify` manual).
    *   *Dica Vercel*: Mantenha `String` por enquanto para evitar refatorar tudo.

## 2. Configuração Vercel

Já criei os arquivos necessários:
- `vercel.json`: Redireciona `/api` para o backend.
- `api/index.js`: Ponto de entrada do Serverless.
- `package.json`: Dependências consolidadas.

### Environment Variables (no Vercel):
No painel do Vercel (Settings > Environment Variables), adicione:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | A string do seu banco PostgreSQL (Neon/Supabase) |
| `JWT_SECRET` | Uma senha secreta longa |
| `LASTFM_API_KEY` | Sua chave Last.fm |
| `LASTFM_SHARED_SECRET` | Seu segredo Last.fm |
| `GEMINI_API_KEY` | Sua chave Google Gemini |
| `VITE_API_URL` | Deixe vazio ou use `/api` (padrão relativo) |

## 3. Comandos de Build

No Vercel, configure:
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 4. Deploy

1.  Envie as alterações para o GitHub.
2.  Importe o projeto no Vercel.
3.  Preencha as variáveis de ambiente.
4.  Deploy! 🚀

---

## ⚠️ Atenção: Migração SQLite -> Postgres

Seu código atual salva `tracks` como string JSON no SQLite.
Se mudar para Postgres, o Prisma pode reclamar se você tentar usar o tipo `Json` nativo sem ajustar o código.
**Recomendação**: Mantenha `tracks String` no `schema.prisma` mesmo usando Postgres para garantir que o deploy funcione sem reescrever o backend agora.
