# 🚀 Omega Nexus AI OS — Multi-Platform Deployment Guide

This guide walks you through deploying **Omega Nexus AI OS** across the production cloud architecture.

---

## 🏛️ Deployment Architecture Matrix

| Component | Platform | URL / Configuration | Secrets Location |
| :--- | :--- | :--- | :--- |
| **Source Code** | **GitHub** | `https://github.com/pushka2006/omega-nexus.git` | `.gitignore` protected (No secrets in Git) |
| **Static Demo** | **GitHub Pages** | `https://pushka2006.github.io/omega-nexus` | Automated GitHub Actions CI/CD |
| **Main Frontend** | **Vercel** | `https://omega-nexus.vercel.app` | Vercel Environment Variables |
| **FastAPI Backend** | **Render** | `https://omega-nexus-backend.onrender.com` | Render Environment Variables |
| **Database** | **MongoDB Atlas** | `mongodb+srv://...` cluster | Injected via Render `MONGODB_URI` |
| **Redis Cache** | **Upstash / Redis Cloud** | `rediss://...` endpoint | Injected via Render `REDIS_URL` |
| **AI APIs** | **Backend Only** | OpenAI, Anthropic, Emergent LLM | Strictly in Render (0 client exposure) |

---

## 1. 🗄️ Database Setup (MongoDB Atlas — Free Tier)

1. Sign up / Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **Free Shared Cluster** (M0).
3. Under **Security → Database Access**:
   - Create a database user (e.g. `nexus_admin`) with a secure password.
4. Under **Security → Network Access**:
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere, so Render backend can connect).
5. Click **Connect → Drivers (Python)**:
   - Copy your connection string:
     ```
     mongodb+srv://nexus_admin:<password>@cluster0.xxxxx.mongodb.net/nexus_os?retryWrites=true&w=majority
     ```
   *(Keep this connection string ready for Step 3).*

---

## 2. ⚡ Redis Setup (Upstash Redis — Free Tier)

1. Sign up / Log in to [Upstash](https://upstash.com).
2. Click **Create Database**:
   - Name: `omega-nexus-redis`
   - Region: Select region closest to your Render service (e.g. US East / US West).
3. Under **Details → Connect**:
   - Copy the **`REDIS_URL`** (format: `rediss://default:<password>@<endpoint>.upstash.io:6379`).
   *(Keep this connection string ready for Step 3).*

---

## 3. 🐍 Python/FastAPI Backend Deployment (Render)

### Option A: 1-Click Blueprint Deploy (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New + → Blueprint**.
3. Connect your repository: `pushka2006/omega-nexus`.
4. Render will automatically detect [`render.yaml`](render.yaml) and configure the `omega-nexus-backend` web service.
5. In the environment setup, paste your actual secrets:
   - `MONGODB_URI`: (From Step 1)
   - `REDIS_URL`: (From Step 2)
   - `OPENAI_API_KEY`: `sk-proj-...`
   - `ANTHROPIC_API_KEY`: (Optional)
   - `EMERGENT_LLM_KEY`: (Optional)
6. Click **Apply**. Render will build and launch your backend at `https://omega-nexus-backend.onrender.com`.

### Option B: Manual Web Service
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
- **Health Check Path**: `/api/`

---

## 4. ⚡ Main Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Click **Import Repository** and select `pushka2006/omega-nexus`.
3. In the project configuration:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: Select `frontend` (or leave default if deploying with root [`vercel.json`](vercel.json)).
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Expand **Environment Variables** and add:
   ```env
   REACT_APP_BACKEND_URL = https://omega-nexus-backend.onrender.com
   ```
   *(Replace with your actual Render backend URL from Step 3).*
5. Click **Deploy**. Vercel will build and assign an instant production HTTPS URL (e.g., `https://omega-nexus.vercel.app`).

---

## 5. 🌐 Static Demo Deployment (GitHub Pages)

A GitHub Actions workflow is already configured at [`.github/workflows/deploy-gh-pages.yml`](.github/workflows/deploy-gh-pages.yml).

1. In your GitHub repository (`pushka2006/omega-nexus`), go to **Settings → Pages**.
2. Under **Build and deployment → Source**:
   - Select **Deploy from a branch**.
   - Branch: `gh-pages` / `/ (root)`.
3. Whenever you push changes to `main`, GitHub Actions will automatically compile the frontend and deploy to `https://pushka2006.github.io/omega-nexus`.

---

## 6. 🔒 Secrets & Security Checklist

- [x] **No Secrets in Source Code**: `.env`, `.env.*`, keys, and token files are ignored in [`.gitignore`](.gitignore).
- [x] **Backend-Only AI Execution**: LLM API keys (`OPENAI_API_KEY`, etc.) are consumed exclusively on Render and never bundled into the client build.
- [x] **CORS Security**: Backend handles dynamic origins (`https://omega-nexus.vercel.app`, `https://pushka2006.github.io`) securely.
- [x] **Zero Hardcoded Passwords**: All databases use connection strings supplied at runtime via environment variables.

---

## 7. 🧪 Testing & Verification

Once deployed:
1. Open your Vercel URL: `https://omega-nexus.vercel.app`
2. Navigate to:
   - `/legal` → Verify real-time 36 AI agent complaint telemetry and "Welcome back, Pushkar 👋".
   - `/marketing` → Verify live DuckDuckGo web search integration and ad generation.
   - `/agents` → Verify all 36 AI agents are online and responsive.
3. Test Backend Health:
   - `GET https://omega-nexus-backend.onrender.com/api/` → Returns `{"app": "NEXUS AI OS", "status": "online"}`.
