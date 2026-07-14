# EcoSphere ESG Platform

## Quick Deploy

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and set your values:
```
JWT_SECRET=your_secret_key_here
PORT=4000
FRONTEND_URL=http://localhost:5173
```

### 3. Start backend (serves frontend in production)
```bash
NODE_ENV=production node src/index.js
```

The app will auto-create the SQLite database and seed sample data on first run.

### 4. (Optional) Rebuild frontend
```bash
npm run build
```

## Dev Mode
Run backend and frontend separately:
```bash
# Terminal 1 - Backend
node src/index.js

# Terminal 2 - Frontend
npm run dev
```

## Default Login
- Admin: `admin@ecosphere.com` / `admin123`
- Employee: `employee@ecosphere.com` / `emp123`
