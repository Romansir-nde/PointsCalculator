# KUCCPS Real-Time Cluster Points Calculator

Professional KCSE Grade and KUCCPS Cluster Point Calculator with real-time cluster eligibility, comprehensive course database, and admin analytics.

## 📋 Features

- ✅ **Official KUCCPS Formula**: sqrt((r/R)×(t/T))×48
- ✅ **7-Subject Selection Logic**: Math (mandatory) + best of ENG/KIS + top 5 others
- ✅ **All 23 Clusters**: Complete cluster definitions with subject requirements
- ✅ **345+ Courses**: Comprehensive course database across all clusters with level tags
- ✅ **Real-Time Calculation**: Instant cluster point computation
- ✅ **Course Eligibility**: View eligible courses by cluster with university listings
- ✅ **Admin Dashboard**: Passkey management and text analyzer
- ✅ **Full Stack**: React + TypeScript + Express + MongoDB

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js 16+
- MongoDB (local or cloud URI)
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure .env with:
MONGODB_URI=mongodb://localhost:27017/kuccps
PORT=4000
DEFAULT_PASSKEY=2025
ADMIN_USER=ADMIN
ADMIN_PASS=2025

# Run in development
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

## 📊 API Endpoints

### Calculate Cluster Points
**POST** `/api/calculate`
```json
{
  "studentId": "KE20240001",
  "subjects": [
    {"code": "eng", "grade": "A"},
    {"code": "kis", "grade": "B+"},
    {"code": "mat", "grade": "A-"},
    {"code": "bio", "grade": "B"},
    {"code": "phy", "grade": "B-"},
    {"code": "che", "grade": "B"},
    {"code": "bst", "grade": "B+"}
  ]
}
```

### Get All Clusters
**GET** `/api/clusters`

### Get Cluster Cutoffs
**GET** `/api/clusters/cutoffs`

### Get Courses
**GET** `/api/courses` (all courses)
**GET** `/api/courses/:clusterId` (courses by cluster)

### Admin Endpoints
- **GET** `/api/admin/passkey` - Get current passkey
- **POST** `/api/admin/change-passkey` - Change passkey (requires auth headers)
- **POST** `/api/admin/analyze` - Text analyzer (requires auth headers)

Admin auth headers:
```
adminuser: ADMIN
adminpass: 2025
```

## 🗄️ Database Schema

### Passkey Model
```typescript
{
  key: string;
  createdBy: string;
  createdAt: Date;
}
```

## 📦 Deployment

### Vercel (Frontend)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Heroku/Railway (Backend)
```bash
cd server
npm run build
npm start
```

### Environment Variables
**Frontend (.env.local)**:
```
VITE_API_URL=https://your-backend-url.com/api
```

**Backend (.env)**:
```
MONGODB_URI=your_mongodb_uri
PORT=4000
DEFAULT_PASSKEY=2025
ADMIN_USER=ADMIN
ADMIN_PASS=2025
```

## ✅ Pre-Deployment Checklist

- [x] All 23 clusters defined with subject groups
- [x] KUCCPS 2024 cutoff data populated
- [x] 345+ courses across all clusters
- [x] Formula engine tested (jest tests)
- [x] Admin authentication implemented
- [x] Passkey management functional
- [x] Frontend-backend API integration complete
- [x] TypeScript compilation successful
- [x] Jest tests passing
- [x] Environment variables configured
- [x] MongoDB connection tested
- [x] CORS configured for cross-origin requests

## 🧪 Running Tests

```bash
cd server
npm test
```

## 📝 Sample Calculation

**Input**: Student with 7 A grades in all subjects
**AGP**: 84 (7 × 12)
**Example Cluster 1 (Law)**: With all A grades, cluster points = sqrt((48/48)×(84/84))×48 = **48.000**
**Cluster 23 (Theology)**: Same calculation = **48.000**

## 🔐 Security

- Admin endpoints require header-based authentication
- MongoDB connection via secure URI
- CORS enabled for frontend communication
- Environment variables for sensitive data
- Default passkey: 2025 (change in production)

## 📞 Support

For issues or questions, create an issue in the repository.

---

**Status**: ✅ Ready for Production Deployment
