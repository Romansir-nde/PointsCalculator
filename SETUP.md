# KUCCPS Calculator - Complete Setup Guide

## 📋 Project Overview

**Full-Stack KUCCPS Real-Time Cluster Points Calculator**
- Frontend: React 19 + TypeScript + Vite + Tailwind
- Backend: Express + TypeScript + MongoDB + Mongoose
- Features: Official formula calculation, 345+ courses, admin analytics

---

## 🏗️ Project Structure

```
root/
├── App.tsx                      # Main React component
├── index.tsx                    # React entry point
├── index.html                   # HTML template
├── constants.tsx                # App constants
├── types.ts                     # TypeScript types
├── utils.ts                     # Utility functions
├── formulaCalculator.ts         # Legacy calculator
├── clusterCourses.ts            # Legacy course data
├── clusterCutoffs.ts            # Legacy cutoff data
├── package.json                 # Frontend dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite config
├── .env.local.example           # Frontend env template
├── README.md                    # Main documentation
├── DEPLOYMENT.md                # Deployment guide
├── SETUP.md                     # This file
│
└── server/                      # Backend Node.js app
    ├── package.json             # Backend dependencies (Express, Jest, etc.)
    ├── tsconfig.json            # Backend TypeScript config
    ├── jest.config.js           # Jest testing config
    ├── .env.example             # Backend env template
    ├── README.md                # Backend API documentation
    │
    └── src/
        ├── index.ts             # Express server entry point
        │
        ├── routes/              # API route handlers
        │   ├── calculate.ts      # POST /api/calculate endpoint
        │   ├── clusters.ts       # GET /api/clusters endpoints
        │   ├── courses.ts        # GET /api/courses endpoints
        │   └── admin.ts          # Admin endpoints with auth
        │
        ├── lib/                 # Core business logic
        │   ├── formula.ts        # KUCCPS formula engine
        │   └── formula.test.ts   # Jest unit tests (6 tests)
        │
        ├── models/              # Mongoose schemas
        │   └── Passkey.ts        # Passkey model for auth
        │
        └── data/                # JSON data files
            ├── clusters.json     # 23 cluster definitions
            ├── cutoffs.json      # KUCCPS 2024 cutoff data
            └── courses.json      # 345+ courses database
```

---

## 🚀 Quick Start (5 Minutes)

### 1. Clone & Install
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment
```bash
# Copy backend env template
cp server/.env.example server/.env

# Edit server/.env and set:
# MONGODB_URI=mongodb://localhost:27017/kuccps
# PORT=4000
# DEFAULT_PASSKEY=2030
# ADMIN_USER=ADMIN
# ADMIN_PASS=2030
```

### 3. Start Services
```bash
# Terminal 1: Start backend (from root directory)
cd server
npm run dev

# Terminal 2: Start frontend (from root directory)
npm run dev
```

### 4. Test
- Open http://localhost:5173
- Enter 7 subject grades (Math compulsory)
- Click "Calculate"
- Verify cluster points display
- Click "View Courses" to see eligible courses

---

## 📦 Installation Details

### Prerequisites
- **Node.js**: 16+ (check with `node --version`)
- **npm**: 8+ (check with `npm --version`)
- **MongoDB**: Local or Atlas cloud URI
- **Git**: For version control

### Frontend Installation
```bash
# Install React, TypeScript, Vite, Tailwind
npm install

# Install specific versions (optional)
npm install react@19.2.3 react-dom@19.2.3
npm install --save-dev @vitejs/plugin-react vite@6.2.0
npm install --save-dev typescript@5.8.2
npm install -D tailwindcss postcss autoprefixer
```

### Backend Installation
```bash
cd server

# Install core dependencies
npm install express@4.18.2 cors@2.8.5 dotenv@16.0.0 mongoose@7.0.0

# Install dev dependencies
npm install --save-dev typescript@5.0.0
npm install --save-dev ts-node-dev@2.0.0
npm install --save-dev jest@29.0.0 ts-jest@29.0.0
npm install --save-dev @types/express@4.17.17
npm install --save-dev @types/node@18.0.0
npm install --save-dev @types/jest@29.0.0
```

---

## 🗂️ Key Files Explained

### Frontend Entry Points

**App.tsx** (Main Component)
```typescript
- calculateClusterPoints()    // Calls backend /api/calculate
- viewCourses()               // Displays courses from /api/courses
- handleGradeChange()         // Updates subject grades
```

**types.ts** (Type Definitions)
```typescript
- Subject: enum of subject codes (eng, kis, mat, bio, etc.)
- Grade: type of KCSE grades (A, B+, B, C+, etc.)
- ClusterResult: cluster calculation result
```

**constants.tsx** (Configuration)
```typescript
- GRADE_POINTS: Maps grades to points (A=12, B=9, etc.)
- CLUSTERS: 23 cluster definitions
- SUBJECTS: Subject metadata
```

### Backend Entry Points

**server/src/index.ts** (Express App)
```typescript
- Connects to MongoDB
- Initializes Express with CORS
- Mounts all route handlers
- Seeds default passkey on first run
```

**server/src/lib/formula.ts** (Core Engine)
```typescript
- buildSelectedSeven()        // Selects 7 best subjects
- gradeToPoints()             // Converts grade to points
- calculateClusterPoints()    // Computes C = sqrt((r/R)×(t/T))×48
- computeAllClusters()        // Calculates all 23 clusters
```

**server/src/routes/calculate.ts** (Main API)
```typescript
- POST /api/calculate         // Main calculation endpoint
- Input: {subjects: SubjectGrade[]}
- Output: {agp, clusters[], recommendedCourses[]}
```

---

## 📊 Data Files

### clusters.json
```json
{
  "id": 1,
  "name": "Engineering & Related Technology",
  "subjects": [
    ["mat", "phy"],                    // Group 1: Math or Physics
    ["mat", "che"],                    // Group 2: Math or Chemistry
    ["eng", "kis"],                    // Group 3: English or Kiswahili
    ["bio", "bst", "agr", "vet", ...] // Group 4: Best of remaining
  ]
}
```

### cutoffs.json
```json
{
  "1": {
    "universities": [
      {
        "name": "University of Nairobi",
        "cutoffPoints": 41.2,
        "programmeCount": 8
      },
      ...
    ]
  }
}
```

### courses.json
```json
{
  "1": [
    {
      "course": "Bachelor of Laws (LL.B)",
      "universities": ["University of Nairobi", "JKUAT", ...],
      "level": "degree"
    },
    ...
  ]
}
```

---

## 🧪 Testing

### Run Jest Tests
```bash
cd server

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- formula.test.ts

# Watch mode (auto-rerun on changes)
npm test -- --watch
```

### Test Cases
1. ✅ buildSelectedSeven selects 7 subjects correctly
2. ✅ gradeToPoints converts grades (A=12, B=9, etc.)
3. ✅ Missing Math returns empty selection
4. ✅ Best of ENG/KIS selected (higher points wins)
5. ✅ AGP calculation correct (7 subjects summed)
6. ✅ Cluster points within 0.000-48.000 range

### Manual Testing

**Test 1: Perfect Student (All A's)**
```json
{
  "subjects": [
    {"code": "eng", "grade": "A"},
    {"code": "mat", "grade": "A"},
    {"code": "kis", "grade": "A"},
    {"code": "bio", "grade": "A"},
    {"code": "phy", "grade": "A"},
    {"code": "che", "grade": "A"},
    {"code": "bst", "grade": "A"}
  ]
}
```
Expected: AGP=84, All clusters points=48.000

**Test 2: Mixed Grades**
```json
{
  "subjects": [
    {"code": "eng", "grade": "B+"},
    {"code": "mat", "grade": "A-"},
    {"code": "kis", "grade": "B"},
    {"code": "bio", "grade": "B"},
    {"code": "phy", "grade": "C+"},
    {"code": "che", "grade": "B-"},
    {"code": "bst", "grade": "C"}
  ]
}
```
Expected: AGP=57, Cluster points vary by cluster

**Test 3: Missing Math (Invalid)**
```json
{
  "subjects": [
    {"code": "eng", "grade": "A"},
    {"code": "kis", "grade": "A"},
    {"code": "bio", "grade": "A"},
    {"code": "phy", "grade": "A"},
    {"code": "che", "grade": "A"},
    {"code": "bst", "grade": "A"}
  ]
}
```
Expected: Error - "Math grade is required"

---

## 🔑 API Examples

### Calculate Cluster Points
```bash
curl -X POST http://localhost:4000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "subjects": [
      {"code": "eng", "grade": "A"},
      {"code": "mat", "grade": "A"},
      {"code": "kis", "grade": "B"},
      {"code": "bio", "grade": "B"},
      {"code": "phy", "grade": "B"},
      {"code": "che", "grade": "B"},
      {"code": "bst", "grade": "B"}
    ]
  }'
```

### Get All Courses
```bash
curl http://localhost:4000/api/courses
```

### Get Courses for Cluster 1
```bash
curl http://localhost:4000/api/courses/1
```

### Get Admin Passkey
```bash
curl http://localhost:4000/api/admin/passkey \
  -H "adminuser: ADMIN" \
  -H "adminpass: 2025"
```

---

## 📝 Development Workflow

### Adding a New Feature

1. **Update types** (if needed)
   ```typescript
   // types.ts - Add new type
   ```

2. **Update backend** (if needed)
   ```typescript
   // server/src/lib/formula.ts - Add business logic
   // server/src/routes/xxx.ts - Add API endpoint
   ```

3. **Add tests**
   ```typescript
   // server/src/lib/formula.test.ts - Add test case
   npm test
   ```

4. **Update frontend** (if needed)
   ```typescript
   // App.tsx - Update UI component
   npm run dev - Test locally
   ```

5. **Document changes**
   ```markdown
   # README.md - Document new feature
   ```

---

## 🚨 Common Issues & Solutions

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Start MongoDB: `mongod` (local) or use MongoDB Atlas URI
- Check MONGODB_URI in .env is correct

### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solution:**
```bash
# Kill process on port 4000
# Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:4000 | xargs kill -9
```

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Ensure CORS is enabled in server/src/index.ts: `app.use(cors())`
- Check VITE_API_URL in frontend matches backend URL

### Issue: Tests Failing
```
npm test fails with errors
```
**Solution:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
npm test -- --verbose
```

### Issue: Frontend not connecting to backend
```
API calls returning 404 or timeout
```
**Solution:**
- Backend must be running: `npm run dev` in server directory
- Check VITE_API_URL in frontend
- Check backend is listening on correct PORT
- Verify MongoDB connection in backend logs

---

## 🎯 Verification Checklist

Run through these before deployment:

- [ ] Frontend builds without errors: `npm run build`
- [ ] Backend builds without errors: `cd server && npm run build`
- [ ] Backend tests pass: `cd server && npm test`
- [ ] Frontend starts: `npm run dev` (port 5173)
- [ ] Backend starts: `cd server && npm run dev` (port 4000)
- [ ] Can calculate cluster points via UI
- [ ] View Courses modal displays courses
- [ ] API endpoints respond correctly (curl tests)
- [ ] Admin endpoints require authentication
- [ ] MongoDB connection established
- [ ] All 23 clusters display
- [ ] 345+ courses in database
- [ ] No console errors in browser
- [ ] No console errors in terminal
- [ ] .env files properly configured
- [ ] .gitignore prevents .env commits

---

## 📞 Support Resources

- **MongoDB**: https://docs.mongodb.com
- **Express**: https://expressjs.com
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Jest**: https://jestjs.io
- **Vite**: https://vitejs.dev

---

## 🎓 Learning Path

If unfamiliar with any technology:

1. **React Basics** (2 hours)
   - https://react.dev/learn

2. **TypeScript Basics** (2 hours)
   - https://www.typescriptlang.org/docs/handbook

3. **Express Basics** (2 hours)
   - https://expressjs.com/starter/hello-world.html

4. **MongoDB Basics** (2 hours)
   - https://docs.mongodb.com/manual/introduction

5. **This Project** (1 hour)
   - Read through the code
   - Run setup steps
   - Test manual examples

---

## 📅 Maintenance Schedule

**Daily**:
- Monitor error logs
- Check API response times

**Weekly**:
- Review database performance
- Check disk space
- Monitor user feedback

**Monthly**:
- Update npm dependencies: `npm update`
- Review security advisories: `npm audit`
- Backup database

**Quarterly**:
- Update Node.js version (if needed)
- Review and refactor code
- Performance optimization review

---

## ✅ Status

**Setup Complexity**: ⭐⭐ (Easy)
**Time to Deploy**: ⭐⭐⭐ (45 minutes)
**Maintenance**: ⭐⭐ (Low)

All systems ✅ **READY FOR PRODUCTION**

---

For questions or issues, refer to README.md or create a GitHub issue.

Last Updated: January 15, 2026
