# CloudApp — React + Node/Express on Google Cloud

A full-stack sample application with a React 19 frontend and Node.js/Express backend, deployed to **Google Cloud Run** via **GitHub Actions** CI/CD.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript, Ant Design 5.x, Tailwind CSS v4, React Router v6 |
| Backend | Node.js 20, Express 4, TypeScript |
| Containerization | Docker (multi-stage builds) |
| Cloud | Google Cloud Run (serverless containers) |
| CI/CD | GitHub Actions + Workload Identity Federation |

---

## Project Structure

```
sample_application/
├── .github/workflows/
│   ├── deploy-backend.yml    # CI/CD: build + deploy backend on push to main
│   └── deploy-frontend.yml   # CI/CD: build + deploy frontend on push to main
│
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express entry point
│   │   └── routes/
│   │       ├── health.ts     # GET /health (Cloud Run liveness probe)
│   │       └── items.ts      # GET/POST/DELETE /api/items
│   ├── Dockerfile            # Multi-stage: tsc → Node 20 Alpine
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/       # AppShell layout (sidebar + header)
│   │   ├── context/          # Global state (AppContext)
│   │   ├── features/         # home, items, about pages
│   │   ├── hooks/            # useApi — generic Axios hook
│   │   ├── routes/           # React Router config
│   │   └── utils/            # Axios client
│   ├── Dockerfile            # Multi-stage: Vite build → Nginx
│   └── nginx.conf            # SPA routing + gzip + caching
│
├── setup-gcp.sh              # One-time GCP bootstrap script
└── README.md
```

---

## CI/CD via GitHub Actions

### How It Works

```
Push to main (backend/ changes)
        │
        ▼
  GitHub Actions
  ┌─────────────────────────────────────────────┐
  │ 1. Authenticate (Workload Identity Fed.)     │
  │ 2. docker build backend/                     │
  │ 3. docker push → Artifact Registry           │
  │ 4. gcloud run deploy sample-app-backend      │
  └─────────────────────────────────────────────┘
        │
        ▼
  ✅ Live on Cloud Run

Push to main (frontend/ changes)
        │
        ▼
  GitHub Actions
  ┌─────────────────────────────────────────────┐
  │ 1. Authenticate (Workload Identity Fed.)     │
  │ 2. docker build --build-arg VITE_API_BASE_URL│
  │ 3. docker push → Artifact Registry           │
  │ 4. gcloud run deploy sample-app-frontend     │
  └─────────────────────────────────────────────┘
        │
        ▼
  ✅ Live on Cloud Run
```

---

## First-Time GCP Setup

### Step 1 — Run the setup script

```bash
# Edit the variables at the top of setup-gcp.sh first!
nano setup-gcp.sh

chmod +x setup-gcp.sh
./setup-gcp.sh
```

This script will:
- Enable required GCP APIs
- Create an Artifact Registry Docker repository
- Create a service account with least-privilege IAM roles
- Set up **Workload Identity Federation** (keyless auth — no JSON keys stored in GitHub)
- Print all the GitHub secret values you need

### Step 2 — Add GitHub Secrets

Go to **GitHub → Repository → Settings → Secrets → Actions** and add:

| Secret | Description | Example |
|---|---|---|
| `GCP_PROJECT_ID` | Your GCP project ID | `my-project-123` |
| `GCP_REGION` | Cloud Run region | `us-central1` |
| `GCP_AR_REPO` | Artifact Registry repo name | `sample-app` |
| `GCP_SERVICE_ACCOUNT` | Service account email | `github-actions-deployer@my-project.iam.gserviceaccount.com` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | WIF provider resource name | `projects/123/locations/global/workloadIdentityPools/...` |
| `BACKEND_URL` | Backend Cloud Run URL *(after 1st backend deploy)* | `https://sample-app-backend-xxx-uc.a.run.app` |
| `FRONTEND_URL` | Frontend Cloud Run URL *(after 1st frontend deploy)* | `https://sample-app-frontend-xxx-uc.a.run.app` |

> **Note:** `BACKEND_URL` and `FRONTEND_URL` create a chicken-and-egg situation on the very first deploy.
> Deploy backend first → copy its URL → set `BACKEND_URL` secret → deploy frontend → copy its URL → set `FRONTEND_URL` secret → redeploy backend (for CORS).

### Step 3 — Push to GitHub

```bash
git init  # if not already a git repo
git remote add origin https://github.com/YOUR_ORG/YOUR_REPO.git
git add .
git commit -m "feat: initial full-stack app with GitHub Actions CI/CD"
git push origin main
```

The GitHub Actions workflows will trigger automatically and deploy both services to Cloud Run.

---

## Local Development

```bash
# Terminal 1 — Backend
cd backend && cp .env.example .env && npm install && npm run dev
# → http://localhost:3001

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
# → http://localhost:5173  (proxies /api/* to backend automatically)
```

### Backend API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check (used by Cloud Run) |
| GET | `/api/items` | List all items |
| POST | `/api/items` | Create item (`{ name, description }`) |
| DELETE | `/api/items/:id` | Delete item by ID |

---

## Environment Variables

### Backend (`.env`)
| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | CORS allowed origin |

### Frontend
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend Cloud Run URL (injected at Docker build time via `--build-arg`) |
