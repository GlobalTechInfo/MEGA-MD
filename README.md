<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=MEGA-MD&fontSize=72&fontColor=fff&animation=twinkling&fontAlignY=32&desc=High%20Performance%20WhatsApp%20Bot&descAlignY=55&descSize=20" width="100%"/>

<br/>

[![Typing SVG](https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&size=22&pause=1000&color=25D366&center=true&vCenter=true&width=600&lines=Multi-Device+WhatsApp+Bot;250%2B+Commands+%26+Counting;Plugin+Architecture+%7C+Auto-Loading;Deploy+Anywhere+in+Minutes)](https://git.io/typing-svg)

<br/>

[![Version](https://img.shields.io/badge/Version-6.0.0-blue?style=for-the-badge&logo=github)](https://github.com/GlobalTechInfo/MEGA-MD)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![WhatsApp](https://img.shields.io/badge/Baileys-7.x-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://github.com/WhiskeySockets/Baileys)
[![Stars](https://img.shields.io/github/stars/GlobalTechInfo/MEGA-MD?style=for-the-badge&logo=starship&color=gold)](https://github.com/GlobalTechInfo/MEGA-MD/stargazers)
[![Forks](https://img.shields.io/github/forks/GlobalTechInfo/MEGA-MD?style=for-the-badge&logo=git&color=orange)](https://github.com/GlobalTechInfo/MEGA-MD/network/members)

<br/>

**250+ Commands · Multi-Platform · Multi-Database · Plugin Architecture**

<br/>

[📦 Installation](#-installation) · [🔐 Session Setup](#-getting-your-session-id) · [⚙️ Configuration](#️-configuration) · [🚀 Deployment](#-deployment) · [🔌 Plugins](#-plugin-system)

<br/>

---

### 🌍 Deploy on your favourite platform

[![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)](https://heroku.com)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://render.com)
[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)
[![Koyeb](https://img.shields.io/badge/Koyeb-121212?style=for-the-badge&logo=koyeb&logoColor=white)](https://koyeb.com)
[![Fly.io](https://img.shields.io/badge/Fly.io-7B3FE4?style=for-the-badge&logo=flydotio&logoColor=white)](https://fly.io)
[![Replit](https://img.shields.io/badge/Replit-F26207?style=for-the-badge&logo=replit&logoColor=white)](https://replit.com)
[![VPS](https://img.shields.io/badge/Linux_VPS-FCC624?style=for-the-badge&logo=linux&logoColor=black)](#-vps--linux-server)
[![Termux](https://img.shields.io/badge/Termux-000000?style=for-the-badge&logo=android&logoColor=white)](#-termux-android)
[![Windows](https://img.shields.io/badge/Windows_WSL-0078D4?style=for-the-badge&logo=windows&logoColor=white)](#-windows-wsl)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](#-dockerfile)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [📌 Requirements](#-requirements)
- [⚡ Quick Start](#-quick-start)
- [🔐 Getting Your Session ID](#-getting-your-session-id)
- [⚙️ Configuration](#️-configuration)
- [📦 Installation](#-installation)
- [🚀 Deployment](#-deployment)
  - [📱 Termux](#-termux-android)
  - [🖥️ VPS Linux Server](#-vps-linux-server)
  - [🪟 Windows WSL](#-windows-wsl)
  - [🔁 Replit](#-replit)
  - [🟣 Heroku](#-heroku)
  - [🎨 Render](#-render)
  - [🚂 Railway](#-railway)
  - [☁️ Koyeb](#-koyeb)
  - [🪂 Fly.io](#-flyio)
  - [🐳 Dockerfile](#-dockerfile)
  - [🎮 Discord Panels](#-discord-panels-pterodactyl)
- [🗄️ Storage Backends](#️-storage-backends)
- [🛠️ Environment Variables](#️-environment-variables)
- [📜 npm Scripts](#-npm-scripts)
- [🔌 Plugin System](#-plugin-system)
- [🔧 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🔌 | **Auto-loading Plugins** | Drop a `.ts` file in `plugins/` — it loads automatically, zero registration |
| 💬 | **250+ Commands** | Group management, privacy, moderation, fun, AI, media, utilities |
| 🗄️ | **5 Storage Backends** | MongoDB, PostgreSQL, MySQL, SQLite, or JSON files |
| 🛡️ | **Group Protection** | Anti-spam, bad word filter, link detection, anti-tag abuse |
| 👑 | **Role System** | Owner, Sudo, Admin, and User permission levels |
| ⏰ | **Scheduled Messages** | Schedule messages with natural time input |
| 🤖 | **AI Chatbot** | Per-chat AI conversation mode |
| 🔒 | **Privacy Controls** | Full WhatsApp privacy management via commands |
| 📊 | **Polls & Voting** | Create polls with live vote tracking in groups |
| 📡 | **Broadcast** | Bulk message all groups or all DM contacts at once |
| 🔁 | **Auto-Reply** | Configurable trigger-based auto responses with `{name}` support |
| 🎮 | **Games** | TicTacToe and more built in |
| ⏳ | **Disappearing Messages** | Set per-chat or default timers via commands |
| 📱 | **Multi-Platform** | Runs on Termux, VPS, Railway, Render, Heroku, Koyeb, Fly.io, Replit |

---

## 📌 Requirements

| Requirement | Version | Notes |
|---|---|---|
| ![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white) | **20.x or higher** | Required |
| ![npm](https://img.shields.io/badge/npm-8%2B-CB3837?logo=npm&logoColor=white) | 8.x or higher | Included with Node.js |
| ![Git](https://img.shields.io/badge/Git-latest-F05032?logo=git&logoColor=white) | Any recent | For cloning |
| ![ffmpeg](https://img.shields.io/badge/ffmpeg-latest-007808?logo=ffmpeg&logoColor=white) | Latest | Media processing |
| ![libvips](https://img.shields.io/badge/libvips-latest-blueviolet) | Latest | Image processing |
| ![libwebp](https://img.shields.io/badge/libwebp-latest-blue) | Latest | Sticker creation |

> [!WARNING]
> **Never use your personal WhatsApp number for the bot.** Always use a dedicated number.

---

## ⚡ Quick Start

```bash
git clone https://github.com/maddix123/MEGA-MD.git
cd MEGA-MD
npm install
cp sample.env .env
# Edit .env → add SESSION_ID and OWNER_NUMBER
npm start

npm i -g pm2 && pm2 start index.js -f && pm2 save && pm2 logs
```

---

## 🔐 Getting Your Session ID
> [!IMPORTANT]
> The bot uses a **Session ID** to connect to WhatsApp without scanning QR every time. Generate it once and paste it in `.env`.

### Step 1 — Open the session generator

> 🌐 **https://mega-pairing.onrender.com**

### Step 2 — Generate your session

**Option A — Pair Code** *(Recommended)*

1. Enter your bot's WhatsApp number with country code (e.g. `923001234567`)
2. Click **Generate Pair Code**
3. An 8-character code appears (e.g. `J38K-4PNS`)
4. On your phone: **WhatsApp → ⋮ Menu → Linked Devices → Link a Device → Link with phone number**
5. Enter the code — session is created
6. Copy the **Session ID** shown on the page

**Option B — QR Code**

1. Click the **QR Code** tab
2. Scan the QR code with your WhatsApp
3. Copy the **Session ID** shown after scanning

### Step 3 — Add to `.env`

```env
SESSION_ID=GlobalTechInfo/MEGA-MD_xxxxxxxxxxxxxxxxxxxxxxxx
```

### Alternative — Pairing via terminal

Leave `SESSION_ID` empty and set:

```env
PAIRING_NUMBER=923001234567
```

> [!NOTE]
> The bot will print an 8-character pairing code in the terminal on startup. Link it via **WhatsApp → Linked Devices → Link with phone number** within 60 seconds.

---

## ⚙️ Configuration

Copy `sample.env` to `.env`:

```bash
cp sample.env .env
```

```env
# ── REQUIRED (choose one) ────────────────────────────────────
SESSION_ID=GlobalTechInfo/MEGA-MD_your_gist_id_here
# OR
PAIRING_NUMBER=923001234567

# ── REQUIRED ─────────────────────────────────────────────────
OWNER_NUMBER=923000000000        # No + sign

# ── BOT IDENTITY ─────────────────────────────────────────────
BOT_NAME=MEGA-MD-PRO
BOT_OWNER=GlobalTechInfo
PACKNAME=MEGA-MD

# ── BEHAVIOUR ────────────────────────────────────────────────
PREFIXES=.,!,/                   # Comma-separated
COMMAND_MODE=public              # public or private
TIMEZONE=Asia/Karachi

# ── OPTIONAL API KEYS ────────────────────────────────────────
REMOVEBG_KEY=                    # https://remove.bg/api
GIPHY_API_KEY=                   # https://developers.giphy.com

# ── PERFORMANCE ──────────────────────────────────────────────
PORT=5000
MAX_STORE_MESSAGES=50

# ── DATABASE (all empty = JSON files) ────────────────────────
MONGO_URL=
POSTGRES_URL=
MYSQL_URL=
DB_URL=                          # SQLite: ./data/baileys.db
```

---

## 📦 Installation

### Manual Install

```bash
# 1. Clone
git clone https://github.com/GlobalTechInfo/MEGA-MD.git
cd MEGA-MD

# 2. Install dependencies
npm install

# 3. Configure
cp sample.env .env
nano .env

# 4. Start
npm start
```

### One-Line VPS Installer

```bash
sudo bash <(curl -fsSL https://raw.githubusercontent.com/GlobalTechInfo/MEGA-MD/main/lib/install.sh)
```
> [!IMPORTANT]
> This automatically installs Node.js 20, ffmpeg, libvips, libwebp, PM2, clones the repo, builds it, and sets up data files.

```bash
# After install:
nano /root/MEGA-MD/.env
cd /root/MEGA-MD && pm2 start dist/index.js --name mega-md
pm2 save && pm2 startup
```

---

## 🚀 Deployment

### 📱 Termux (Android)

```bash
# Update packages
pkg update && pkg upgrade -y

# Install proot-distro (recommended for full Linux environment)
pkg install proot-distro -y
proot-distro install ubuntu
proot-distro login ubuntu

# Inside Ubuntu — install dependencies
apt update && apt upgrade -y
apt install -y git ffmpeg build-essential libvips-dev webp nodejs npm curl

# Clone and setup
git clone https://github.com/GlobalTechInfo/MEGA-MD.git
cd MEGA-MD
npm install
cp sample.env .env && nano .env
npm start
```

**Keep running after closing Termux:**

```bash
apt install tmux -y

tmux new -s mega-md    # Start new session
npm start

# Detach:     Ctrl+B → D
# Re-attach:  tmux attach -t mega-md
# List:       tmux ls
# Kill:       tmux kill-session -t mega-md
```

---

### 🖥️ VPS Linux Server

[![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=flat-square&logo=ubuntu&logoColor=white)](https://ubuntu.com)
[![Debian](https://img.shields.io/badge/Debian-A81D33?style=flat-square&logo=debian&logoColor=white)](https://debian.org)

**One-line install (recommended):**
```bash
sudo bash <(curl -fsSL https://raw.githubusercontent.com/GlobalTechInfo/MEGA-MD/main/lib/install.sh)
```

**Manual:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git ffmpeg libvips-dev libwebp-dev build-essential

git clone https://github.com/GlobalTechInfo/MEGA-MD.git
cd MEGA-MD
npm install
cp sample.env .env && nano .env

# Keep alive with PM2
npm install -g pm2
pm2 start dist/index.js --name mega-md
pm2 save && pm2 startup
```

**PM2 commands:**

| Command | Description |
|---|---|
| `pm2 logs mega-md` | Live logs |
| `pm2 restart mega-md` | Restart |
| `pm2 stop mega-md` | Stop |
| `pm2 status` | Status overview |

---

### 🪟 Windows (WSL)

[![Windows](https://img.shields.io/badge/Windows_11-0078D4?style=flat-square&logo=windows11&logoColor=white)](https://microsoft.com/windows)

```bash
# In WSL Ubuntu terminal
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git ffmpeg libvips-dev libwebp-dev build-essential

git clone https://github.com/GlobalTechInfo/MEGA-MD.git
cd MEGA-MD
npm install
cp sample.env .env && nano .env
npm start
```

---

### 🔁 Replit

[![Replit](https://img.shields.io/badge/Replit-F26207?style=flat-square&logo=replit&logoColor=white)](https://replit.com)
> [!NOTE]
> The repo includes pre-configured `.replit` and `replit.nix`.

1. Go to [replit.com](https://replit.com) → **Create Repl** → **Import from GitHub**
2. Paste: `https://github.com/GlobalTechInfo/MEGA-MD`
3. Open **Secrets** tab (🔒) and add:

   | Key | Value |
   |---|---|
   | `SESSION_ID` | `GlobalTechInfo/MEGA-MD_your_gist_id` |
   | `OWNER_NUMBER` | `923001234567` |

4. Click **Run**

`replit.nix` automatically installs: Node.js 20, ffmpeg, imagemagick, libwebp, SQLite, pm2 etc.

> [!TIP]
> Free Replit instances sleep after inactivity. Use [UptimeRobot](https://uptimerobot.com) to ping your Replit URL every 5 minutes to keep it alive.
> [!NOTE]
> Production deployment uses `npm run start:optimized` (512MB memory limit) — configured in `.replit`'s `[deployment]` section.

---

### 🟣 Heroku

[![Heroku](https://img.shields.io/badge/Heroku-430098?style=flat-square&logo=heroku&logoColor=white)](https://heroku.com)
> [!NOTE]
> The repo includes `heroku.yml` and `app.json` for Docker-based deployment.
> 
> Either you can deploy via dashboard or using heroku cli

**One-line Deployer:**
```bash
bash <(curl -s https://raw.githubusercontent.com/GlobalTechInfo/MEGA-MD/main/lib/heroku.sh)
```
**Manual:**
```bash
heroku login
heroku create your-bot-name
heroku stack:set container

heroku config:set SESSION_ID=GlobalTechInfo/MEGA-MD_your_gist_id
heroku config:set OWNER_NUMBER=923001234567
heroku config:set MONGO_URL=your_mongodb_url   # Recommended

git push heroku main
heroku ps:scale web=1
heroku logs --tail
```

> [!IMPORTANT]
> Heroku's filesystem is **ephemeral** — data is lost on restart. Use MongoDB or PostgreSQL for persistent storage.
> [!NOTE]
> Heroku uses `heroku.yml` → Docker build → runs `npm run start:optimized`.

---

### 🎨 Render

[![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black)](https://render.com)
> [!NOTE]
> The repo includes `render.yaml` for one-click Blueprint deployment.

1. Fork this repo
2. [render.com](https://render.com) → **New** → **Blueprint** → connect your fork
3. Render reads `render.yaml` automatically
4. Set environment variables in the dashboard:
   - `SESSION_ID`
   - `OWNER_NUMBER`
5. Deploy

> [!IMPORTANT]
> Render uses Docker (`Dockerfile`) and runs `npm run start:optimized`. Use a database for persistent storage on Render's free tier.

---

### 🚂 Railway

[![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white)](https://railway.app)

1. Fork this repo
2. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub Repo**
3. Select your fork
4. **Variables** tab → add:

   | Key | Value |
   |---|---|
   | `SESSION_ID` | `GlobalTechInfo/MEGA-MD_your_gist_id` |
   | `OWNER_NUMBER` | `923001234567` |

5. Railway auto-builds via `Dockerfile` and deploys

---

### ☁️ Koyeb

[![Koyeb](https://img.shields.io/badge/Koyeb-121212?style=flat-square&logo=koyeb&logoColor=white)](https://app.koyeb.com)

1. Fork this repo
2. [app.koyeb.com](https://app.koyeb.com) → **Create App** → **GitHub**
3. Select your fork — Koyeb reads `koyeb.yaml`
4. Set `SESSION_ID` and `OWNER_NUMBER` in env vars
5. Deploy

---

### 🪂 Fly.io

[![Fly.io](https://img.shields.io/badge/Fly.io-7B3FE4?style=flat-square&logo=flydotio&logoColor=white)](https://fly.io)
> [!NOTE]
> The repo includes `fly.toml` pre-configured (512MB RAM, port 5000, region: US East).
> 
> Either deploy via dashboard or using cli

**One-line Deployer:**
```bash
bash <(curl -s https://raw.githubusercontent.com/GlobalTechInfo/MEGA-MD/main/lib/fly.sh)
```
**Manual:**
```bash
curl -L https://fly.io/install.sh | sh
fly auth login

fly launch --no-deploy
fly secrets set SESSION_ID=GlobalTechInfo/MEGA-MD_your_gist_id
fly secrets set OWNER_NUMBER=923001234567
fly deploy

fly logs   # View logs
```

`fly.toml` settings: auto-start enabled, auto-stop **disabled** so the bot stays running 24/7.

---

### 🐳 Dockerfile

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
> [!NOTE]
> The repo includes a `Dockerfile` for any Docker-compatible platform.

```bash
# Build image
docker build -t mega-md .

# Run
docker run -d \
  -e SESSION_ID=GlobalTechInfo/MEGA-MD_your_gist_id \
  -e OWNER_NUMBER=923001234567 \
  -p 5000:5000 \
  --name mega-md \
  mega-md

# Logs
docker logs -f mega-md
```

---

### 🎮 Discord Panels (Pterodactyl)
> [!IMPORTANT]
> For Pterodactyl-based hosting panels (Fosshost, Skynode, Optiklink etc.):
> Use brave browser or any adguard to avoid ads from hosting panels

1. Create server with a **Node.js 20+ egg**
2. Set startup command:
   ```
   npm install && npm start
   ```
3. Upload files via SFTP or file manager
4. Add env vars in the **Startup** tab: `SESSION_ID`, `OWNER_NUMBER`
5. Start the server

> [!IMPORTANT]
> Ensure the egg uses **Node.js 20 or newer**. If your panel supports Docker, use the included `Dockerfile` instead for best compatibility.

---

## 🗄️ Storage Backends

> [!NOTE]
> Set one database URL in `.env`. If all are empty, JSON file storage is used automatically — no setup needed.

| Backend | Badge | Best For |
|---|---|---|
| **JSON Files** | ![JSON](https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white) | Local, Termux |
| **MongoDB** | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) | Cloud (recommended) |
| **PostgreSQL** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) | Cloud / VPS |
| **MySQL** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white) | Cloud / VPS |
| **SQLite** | ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white) | VPS (no external DB) |

```env
# MongoDB
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/megamd

# PostgreSQL
POSTGRES_URL=postgresql://user:password@host:5432/megamd

# MySQL
MYSQL_URL=mysql://user:password@host:3306/megamd

# SQLite
DB_URL=./data/baileys.db
```

> [!TIP]
> Get a free MongoDB cluster at [MongoDB Atlas](https://cloud.mongodb.com) — best choice for cloud deployments where the filesystem resets.

---

## 🛠️ Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `SESSION_ID` | ✅ *one of* | — | From mega-pairing.onrender.com |
| `PAIRING_NUMBER` | ✅ *one of* | — | Phone number for terminal pairing |
| `OWNER_NUMBER` | ✅ | `923051391007` | Your number, no `+` |
| `BOT_NAME` | ❌ | `MEGA-MD` | Bot display name |
| `BOT_OWNER` | ❌ | `Qasim Ali` | Owner display name |
| `PACKNAME` | ❌ | `MEGA-MD` | Sticker pack name |
| `PREFIXES` | ❌ | `.,!,/,#` | Comma-separated prefixes |
| `COMMAND_MODE` | ❌ | `public` | `public` or `private` |
| `TIMEZONE` | ❌ | `Asia/Karachi` | Your timezone |
| `PORT` | ❌ | `5000` | HTTP server port |
| `MAX_STORE_MESSAGES` | ❌ | `20` | Messages stored per chat |
| `REMOVEBG_KEY` | ❌ | — | [remove.bg](https://remove.bg) API key |
| `GIPHY_API_KEY` | ❌ | — | [Giphy](https://developers.giphy.com) API key |
| `MONGO_URL` | ❌ | — | MongoDB connection string |
| `POSTGRES_URL` | ❌ | — | PostgreSQL connection string |
| `MYSQL_URL` | ❌ | — | MySQL connection string |
| `DB_URL` | ❌ | — | SQLite file path |
| `CLEANUP_INTERVAL` | ❌ | `3600000` | Temp cleanup interval (ms) |
| `STORE_WRITE_INTERVAL` | ❌ | `10000` | Store write interval (ms) |

---

## 📜 npm Scripts

| Script | Description |
|---|---|
| `npm start` | Start the bot |
| `npm run start:optimized` | Start with 512MB memory cap *(cloud use)* |
| `npm run start:fresh` | Reset data files then start |
| `npm run dev` | Watch mode with auto-restart |
| `npm run reset-data` | Re-initialize all JSON data files |
| `npm run reset-session` | Delete `session/` folder |
| `npm run lint` | Run ESLint |
| `npm test` | Run all tests |

---

## 🔌 Plugin System

> [!IMPORTANT]
> Plugins live in `plugins/` and are auto-loaded on startup — no registration needed. Each file must export a `default` object.

### Plugin Template

```js
export default {
    command: 'mycommand',
    aliases: ['mc', 'mycmd'],
    category: 'utility',
    description: 'Does something cool',
    usage: '.mycommand <input>',

    // Optional permission flags
    ownerOnly: false,      // Owner/sudo only
    groupOnly: false,      // Groups only
    adminOnly: false,      // Group admins only
    isPrefixless: true,    // Works without prefix too
    cooldown: 5,           // Cooldown in seconds

    async handler(sock: any, message: any, args: any[], context: any = {}) {
        const {
            chatId,           // Chat JID
            senderId,         // Sender JID
            isGroup,          // boolean
            isSenderAdmin,    // boolean
            isBotAdmin,       // boolean
            senderIsOwnerOrSudo, // boolean
            rawText,          // Full message text
            userMessage,      // Lowercase message
            config,           // Bot configuration 
            channelInfo       // MEGA-MD branding spread
        } = context;

        await sock.sendMessage(chatId, {
            text: `You said: ${args.join(' ')}`,
            ...channelInfo
        }, { quoted: message });
    }
};
```

---

## 🔧 Troubleshooting

### Bot not connecting

> [!IMPORTANT]
> - Verify `SESSION_ID` starts with `GlobalTechInfo/MEGA-MD_`
> - If using `PAIRING_NUMBER`, link within 60 seconds of the code appearing
> - Reset session and reconnect: `npm run reset-session && npm start`

### `myAppStateKey not present` (pin/star broken)

Session lost its app state keys. Fix:

```bash
node -e "
const fs = require('fs');
const c = JSON.parse(fs.readFileSync('session/creds.json','utf8'));
delete c.myAppStateKeyId;
fs.writeFileSync('session/creds.json', JSON.stringify(c, null, 2));
console.log('Done');
"
npm start
```

Send any message to the bot — WhatsApp re-syncs keys automatically. They are now preserved across restarts.

### Commands not responding

- Check you're using the right prefix (default `.`)
- `COMMAND_MODE=private` → only owner can use commands
- `OWNER_NUMBER` must have no `+` sign

### Data lost after restart

> [!CAUTION]
> Cloud platforms reset the filesystem on redeploy. Add `MONGO_URL` to use MongoDB — [MongoDB Atlas](https://cloud.mongodb.com) has a free tier.

### Port conflict

```bash
PORT=3000 npm start
```

---

## 🧪 Testing

The codebase has a comprehensive test suite covering all core systems:

```bash
npm test                # Run all 178 tests
npm run test:coverage   # Run with coverage report
npm run test:watch      # Watch mode during development
```

| Test Suite | What's Covered |
|---|---|
| Unit — `myfunc` | 21 utility function tests with real input/output assertions |
| Unit — `commandHandler` | Command registration, alias routing, toggle, suggestions |
| Unit — `isOwner` | JID matching, device suffix stripping, sudo checks |
| Unit — `isBanned` | File-based ban list read/write |
| Unit — `paths` | Data directory resolution |
| Integration — plugins | ALL plugins load, no duplicate commands/aliases, correct field types |
| Integration — `messageHandler` | Full message flow, banned users, error handling |
| Integration — group events | add/remove/promote/demote without crashing |
| Integration — call handling | Anticall reject, warn, empty call safety |

> Uses [Vitest](https://vitest.dev) with a custom Baileys socket mock that simulates real WhatsApp message flows without requiring a live connection.

---

## 🤝 Contributing

1. Fork the repo
2. Create your plugin in `plugins/yourfeature.ts`
3. Follow the plugin template above
4. Test thoroughly
5. Open a Pull Request

---

## 📞 Support

<div align="center">

[![Telegram](https://img.shields.io/badge/Telegram-FF0000?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/Global_TechInfo)
[![WhatsApp](https://img.shields.io/badge/WhatsApp_Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029VagJIAr3bbVBCpEkAM07)
[![GitHub Issues](https://img.shields.io/badge/GitHub_Issues-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/GlobalTechInfo/MEGA-MD/issues)

</div>

---

## ⚠️ Disclaimer

> [!CAUTION]
> This project is **not affiliated with WhatsApp Inc.** Use responsibly and within [WhatsApp's Terms of Service](https://www.whatsapp.com/legal/terms-of-service). The developers are not responsible for account bans or misuse.

---

## 📄 License

[MIT License](LICENSE) · Made with ❤️ by **Qasim Ali** · [GlobalTechInfo](https://github.com/GlobalTechInfo)

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

⭐ **If this project helped you, please give it a star!** ⭐

</div>
