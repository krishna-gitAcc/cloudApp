# CloudApp — React + Node/Express on Google Cloud

A full-stack sample application deployed to **Google Cloud Run** via **GitHub Actions** CI/CD.

## Live Deployment URLs
- **Frontend App:** [https://sample-app-frontend-vvwa2vbofq-uc.a.run.app](https://sample-app-frontend-vvwa2vbofq-uc.a.run.app)
- **Backend API:** [https://sample-app-backend-vvwa2vbofq-uc.a.run.app](https://sample-app-backend-vvwa2vbofq-uc.a.run.app)

---

## Architecture & Technology Reasoning

This application uses a modular, decoupled architecture where the frontend and backend are deployed as separate serverless containers. This approach was chosen to ensure high scalability while keeping free-tier costs low.

### 1. Frontend: React 19 + Vite
* **Usage:** Serves as the user interface, routing, and state management layer. 
* **Advantages:** React provides a component-based architecture for reusable UI. Vite is chosen over Webpack or Create React App because its native ES-module approach provides near-instant local server start times and incredibly fast Hot Module Replacement (HMR).
* **Styling (Ant Design + Tailwind CSS):** Ant Design provides robust, accessible, and complex components (like data tables and modals) out of the box, saving weeks of development time. Tailwind CSS is used for custom layout utilities and responsive design where Ant Design components need adjustment.

### 2. Backend: Node.js + Express 4
* **Usage:** Acts as the REST API layer, handling business logic, data validation, and database interactions.
* **Advantages:** Node.js is lightweight and has a massive ecosystem. Express is the industry standard minimal framework for routing. Using TypeScript on the backend ensures type safety and catches runtime errors at compile time.

### 3. Database: Google Cloud Firestore (NoSQL)
* **Usage:** Stores application data (e.g., items, users) as documents inside collections.
* **Why NoSQL / Firestore?** Firestore was chosen for its seamless integration with Google Cloud Run. It is a serverless database that scales automatically to zero and requires no manual provisioning or connection pooling. As a NoSQL document store, it allows for highly flexible schemas, which is perfect for rapid prototyping and V1 MVPs where data models frequently change.

### 4. Cloud Infrastructure: Google Cloud Run & GitHub Actions
* **Usage:** Cloud Run hosts the Docker containers. GitHub Actions builds and pushes the code automatically on every commit.
* **Advantages:** Cloud Run is fully serverless. It spins down to zero instances when no one is using the app (costing $0) and scales up instantly under traffic. Workload Identity Federation in GitHub Actions means we never have to store long-lived sensitive JSON keys in our repository.

### 5. Free-Tier Viability & Costs
This entire stack is designed to run within the **Google Cloud Free Tier**, making it perfect for a school alumni group with zero budget. The free limits are extremely generous and reset every month:
* **Cloud Run:** 2 million requests per month, and 360,000 GB-seconds of compute time per month. 
* **Firestore:** 50,000 reads, 20,000 writes, and 20,000 deletes **per day**. 1 GB of storage.
* **Artifact Registry:** 0.5 GB of Docker image storage per month.
* **Why this is sufficient:** A typical alumni group of 500-2,000 members will barely scratch the surface of 2 million requests per month (approx. 66,000 requests *per day*). Because Cloud Run scales to zero during the night or inactive hours, you only consume compute time when an alumnus actually loads a page, ensuring costs remain at $0.00.

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
│   │   ├── db.ts             # Firestore DB initialization
│   │   ├── index.ts          # Express entry point
│   │   └── routes/
│   │       ├── health.ts     # GET /health (Cloud Run liveness probe)
│   │       └── items.ts      # GET/POST/DELETE /api/items (Firestore CRUD)
│   ├── Dockerfile            # Multi-stage: tsc → Node 20 Alpine
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/       # AppShell layout (sidebar + header)
│   │   ├── features/         # Page-level components
│   │   ├── hooks/            # useApi — generic Axios hook
│   │   └── routes/           # React Router config
│   ├── Dockerfile            # Multi-stage: Vite build → Nginx
│   └── nginx.conf            # SPA routing + gzip + caching
│
└── setup-gcp.sh              # One-time GCP bootstrap script
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
```
*(The frontend follows the exact same pipeline automatically via `deploy-frontend.yml`)*

---

## First-Time GCP Setup

### Step 1 — Run the setup script

```bash
# Edit the variables at the top of setup-gcp.sh first!
nano setup-gcp.sh

chmod +x setup-gcp.sh
./setup-gcp.sh
```

### Step 2 — Add GitHub Secrets

Go to **GitHub → Repository → Settings → Secrets → Actions** and add:

| Secret | Description | Example |
|---|---|---|
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | WIF provider resource name | `projects/123/locations/global/workloadIdentityPools/...` |
| `GCP_SERVICE_ACCOUNT` | Service account email | `github-actions-deployer@my-project.iam.gserviceaccount.com` |
| `BACKEND_URL` | Backend Cloud Run URL *(after 1st backend deploy)* | `https://sample-app-backend-xxx-uc.a.run.app` |
| `FRONTEND_URL` | Frontend Cloud Run URL *(after 1st frontend deploy)* | `https://sample-app-frontend-xxx-uc.a.run.app` |

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
| GET | `/api/items` | List all items (from Firestore) |
| POST | `/api/items` | Create item (`{ name, description }`) |
| DELETE | `/api/items/:id` | Delete item by ID |
