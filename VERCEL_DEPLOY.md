# 🚀 Vercel Deployment - Quick Reference

## Status: ✅ Vercel-Ready

O código está preparado para deploy no Vercel. Quando estiver pronto para fazer deploy, siga os passos abaixo.

---

## 📝 Checklist Rápido

### Antes do Deploy (5 minutos)

1. **Editar `server/prisma/schema.prisma`**:
   - Descomentar o bloco PostgreSQL
   - Comentar o bloco SQLite
   - Mudar `tracks: String` → `tracks: Json`

2. **Commit e Push**:
   ```bash
   git add .
   git commit -m "chore: switch to PostgreSQL for Vercel"
   git push
   ```

### No Vercel Dashboard

3. **Criar Vercel Postgres** (Storage → Create Database → Postgres)
4. **Configurar Variáveis de Ambiente** (Settings → Environment Variables)
5. **Deploy!**

---

## 🔧 Mudanças Necessárias

### 1. Schema Prisma

**Arquivo**: `server/prisma/schema.prisma`

Já está documentado no arquivo! Apenas:
- ✅ Descomentar bloco PostgreSQL
- ✅ Comentar bloco SQLite  
- ✅ Mudar `tracks: String` → `tracks: Json`

### 2. Variáveis de Ambiente

Adicionar no Vercel:
- `DATABASE_URL` (auto-gerado pelo Vercel Postgres)
- `DATABASE_URL_UNPOOLED` (auto-gerado pelo Vercel Postgres)
- `PORT=3001`
- `JWT_SECRET=seu_secret_aqui`
- `VITE_LASTFM_API_KEY=sua_key`
- `VITE_LASTFM_SHARED_SECRET=seu_secret`
- `VITE_GEMINI_API_KEY=sua_key`
- `VITE_SPOTIFY_CLIENT_ID=c9201b4af26542f0a120022ce5572550`
- `VITE_SPOTIFY_REDIRECT_URI=https://seu-projeto.vercel.app/callback`

### 3. Spotify Dashboard

Adicionar redirect URI:
```
https://seu-projeto.vercel.app/callback
```

---

## ✅ O que já está pronto

- ✅ `vercel.json` configurado
- ✅ **Código compatível com ambos os bancos** (SQLite e PostgreSQL)
- ✅ `playlistUtils.js` normaliza tracks automaticamente
- ✅ Backend exporta `app` corretamente
- ✅ Build scripts configurados

---

## 🔄 Como funciona a compatibilidade

O código agora usa **utilitários** que funcionam com ambos os tipos:

```javascript
// playlistUtils.js detecta automaticamente:
// - SQLite: tracks vem como String → faz JSON.parse()
// - PostgreSQL: tracks vem como Json → retorna direto
```

Isso significa:
- 🟢 **Desenvolvimento local**: funciona com SQLite
- 🟢 **Produção Vercel**: funciona com PostgreSQL
- 🟢 **Zero mudanças de código** na hora do deploy!

---

## 📚 Documentação Completa

Para guia detalhado, veja:
- [`implementation_plan.md`](file:///C:/Users/Guilherme/.gemini/antigravity/brain/860e8cdf-d89c-4b4c-ab70-5ef7db86333e/implementation_plan.md) - Passo-a-passo simplificado
- [`vercel_deployment.md`](file:///C:/Users/Guilherme/.gemini/antigravity/brain/860e8cdf-d89c-4b4c-ab70-5ef7db86333e/vercel_deployment.md) - Guia completo com troubleshooting

---

## 💡 Voltar para SQLite

Se quiser voltar ao SQLite depois de testar PostgreSQL:

1. Editar `schema.prisma` (inverter os comentários)
2. Mudar `tracks: Json` → `tracks: String`
3. Executar `npx prisma db push`

O código continua funcionando! 🎉
