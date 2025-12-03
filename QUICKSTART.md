# 🚀 Quick Start Guide

## Step 1: Get API Credentials

### Spotify Developer Account

1. Go to https://developer.spotify.com/dashboard
2. Log in with your Spotify account
3. Click **"Create app"**
4. Fill in the form:
   - **App name**: Music Horizon
   - **App description**: Music discovery app
   - **Redirect URI**: `http://127.0.0.1:5173/callback`
   - Check the terms of service box
5. Click **"Save"**
6. On the app page, click **"Settings"**
7. Copy your **Client ID** (you'll need this later)
8. Scroll down to **"Users and Access"** and click **"Add new user"**
9. Add your Spotify account email (required while in Development Mode)

### Last.fm API Account

1. Go to https://www.last.fm/api/account/create
2. Fill in the form:
   - **Application name**: Music Horizon
   - **Application description**: Music discovery
   - **Application homepage**: http://localhost:5173
   - **Callback URL**: (leave blank)
3. Click **"Submit"**
4. Copy your **API Key**

---

## Step 2: Configure the App

1. Open the project folder:
   ```
   d:\website\music-horizon-react
   ```

2. Find the `.env.example` file

3. Create a new file called `.env` (remove the `.example`)

4. Open `.env` and paste your credentials:
   ```env
   VITE_SPOTIFY_CLIENT_ID=paste_your_spotify_client_id_here
   VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
   VITE_LASTFM_API_KEY=paste_your_lastfm_api_key_here
   ```

5. Save the file

---

## Step 3: Run the App

1. Open a terminal in the project folder

2. Run:
   ```bash
   npm run dev
   ```

3. Open your browser to:
   ```
   http://127.0.0.1:5173
   ```

4. Click **"Conectar com Spotify"**

5. Log in and authorize the app

6. Start discovering music! 🎵

---

## 🎯 Quick Test

Once logged in:

1. **Search for music**:
   - Go to "Buscar" in the sidebar
   - Type "Arctic Monkeys" or "Indie Rock"
   - Click "Buscar"

2. **Play a song** (requires Spotify Premium):
   - Click the play button on any track
   - Music should play in your browser

3. **Create a playlist**:
   - Click "Criar Playlist"
   - Give it a name
   - Go to "Playlists" to see it

4. **Export to Spotify**:
   - Click "Exportar" on your playlist
   - Check your Spotify app - it should appear there!

---

## ⚠️ Troubleshooting

**"Invalid redirect URI"**
- Make sure you added `http://127.0.0.1:5173/callback` exactly in Spotify Dashboard

**"User not registered in app"**
- Add your email in Spotify Dashboard → Settings → Users and Access

**"Premium required" for playback**
- Web Playback SDK requires Spotify Premium (export still works on free)

**"API Key invalid"**
- Double-check your `.env` file has the correct keys
- Restart the dev server after changing `.env`

---

## 📁 Project Location

```
d:\website\music-horizon-react\
```

All files are ready - you just need to add the API keys!
