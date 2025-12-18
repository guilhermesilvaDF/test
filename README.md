# Music Horizon

Uma aplicação moderna de descoberta musical que utiliza Last.fm para recomendações, Google Gemini para IA e Spotify para reprodução e exportação de playlists.

## 🎵 Funcionalidades

- **Gerador de Playlists com IA**: Crie playlists personalizadas a partir de prompts naturais usando Google Gemini.
- **Busca Inteligente**: Busque por artista, música ou gênero.
- **Recomendações Personalizadas**: Descubra novas músicas baseadas no seu histórico do Last.fm.
- **Reprodução Integrada**: Ouça as músicas diretamente no navegador via Spotify Web Playback SDK.
- **Gamificação**: Ganhe pontos, suba de nível e desbloqueie conquistas ao explorar novas músicas.
- **Exportação para Spotify**: Salve suas playlists automaticamente no Spotify.
- **Autenticação Segura**: Sistema de login local com persistência em banco de dados.

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+ instalado.
- Conta no Spotify Premium (necessário para Web Playback SDK).
- Credenciais de API do Spotify, Last.fm e Google Gemini.

### 1. Obter Credenciais de API

#### Spotify
1. Acesse [Spotify for Developers](https://developer.spotify.com/dashboard).
2. Crie um novo app.
3. Adicione `http://127.0.0.1:5173/callback` em **Redirect URIs**.
4. Anote o **Client ID**.

#### Last.fm
1. Acesse [Last.fm API](https://www.last.fm/api/account/create).
2. Anote a **API Key** e o **Shared Secret**.

#### Google Gemini
1. Obtenha sua chave em [Google AI Studio](https://makersuite.google.com/app/apikey).

### 2. Configurar o Projeto

```bash
# Instalar dependências do frontend
npm install

# Instalar dependências do backend
cd server
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SPOTIFY_CLIENT_ID=seu_client_id
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
VITE_LASTFM_API_KEY=sua_lastfm_key
VITE_LASTFM_SHARED_SECRET=seu_lastfm_secret
VITE_GEMINI_API_KEY=sua_gemini_key
```

Crie um arquivo `server/.env`:
```env
PORT=3001
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=sua_chave_secreta_jwt
VITE_LASTFM_API_KEY=sua_lastfm_key
VITE_LASTFM_SHARED_SECRET=seu_lastfm_secret
VITE_GEMINI_API_KEY=sua_gemini_key
```

### 4. Inicializar o Banco de Dados

O arquivo de banco de dados (`dev.db`) não é rastreado pelo Git. Em uma nova instalação, você deve criá-lo a partir do schema do Prisma:

```bash
cd server
npx prisma db push
```

Isso criará o arquivo SQLite e aplicará as tabelas necessárias.

### 5. Executar o Projeto

Agora você pode iniciar o Backend e o Frontend com um único comando:

```bash
npm start
```

Isso iniciará:
- **Backend:** `http://localhost:3001`
- **Frontend:** `http://localhost:5173`

*(Se preferir rodar separadamente, use `npm run server` e `npm run dev` em terminais diferentes)*

## 🏗️ Estrutura do Projeto

```
├── src/                # Frontend (React + Vite)
│   ├── components/     # UI Components (Gamification, Player, Layout)
│   ├── pages/          # Páginas (GeneratePlaylist, Dashboard, ForYou)
│   ├── services/       # Clientes de API (Spotify, Last.fm, Gemini Proxy)
│   └── stores/         # Gerenciamento de estado (Zustand)
└── server/             # Backend (Node.js + Express)
    ├── prisma/         # Schema e Banco de Dados (SQLite)
    ├── routes/         # Endpoints da API
    └── server.js       # Ponto de entrada do servidor
```

## 🔧 Tecnologias

- **React 19** - Frontend
- **Node.js & Express** - Backend
- **Prisma & SQLite** - Banco de dados e ORM
- **Zustand** - State management
- **Tailwind CSS** - Estilização
- **Google Gemini API** - Inteligência Artificial
- **Spotify Web API** - Playback e Playlists
- **Last.fm API** - Metadados e Recomendações
