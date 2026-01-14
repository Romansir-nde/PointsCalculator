# KUCCPS Backend (Demo)

This is a minimal Express + TypeScript backend for the KUCCPS cluster points & course eligibility system demo.

Prerequisites
- Node 18+
- MongoDB running (or use a managed MongoDB and set MONGODB_URI)

Setup

1. Copy .env.example to .env and edit MONGODB_URI if needed

2. Install dependencies

```powershell
cd server
npm install
```

3. Run dev server

```powershell
npm run dev
```

API Endpoints
- POST /api/calculate { subjects: [{code, grade}] }
- GET /api/clusters
- GET /api/clusters/cutoffs
- POST /api/admin/change-passkey { newPasskey }
- POST /api/admin/analyze { text }

Notes
- clusters.json contains minimal cluster definitions. Add full 20 clusters for production.
- cutoffs.json contains sample cutoffs. Replace with official KUCCPS cutoffs for real use.
