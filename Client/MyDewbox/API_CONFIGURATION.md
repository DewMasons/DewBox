# API Configuration Guide

## Current Setup

Your frontend is now configured to connect to your local development backend.

### Environment Variables

**File:** `.env`
```env
VITE_API_URL=http://localhost:4000
```

### API Configuration Files Updated

1. **src/services/api.ts** (Main API service)
   - Updated from: `https://dewbox.onrender.com`
   - Updated to: `import.meta.env.VITE_API_URL || 'http://localhost:4000'`

2. **src/config/api.js**
   - Updated from: `http://localhost:3000/api`
   - Updated to: `http://localhost:4000`

3. **src/config/api.config.js**
   - Already configured correctly with environment variable support

## Development vs Production

### Development (Current)
```env
VITE_API_URL=http://localhost:4000
```

### Production
When deploying, update `.env` to:
```env
VITE_API_URL=https://your-production-api.com
```

## How It Works

1. The frontend reads `VITE_API_URL` from `.env` file
2. If not set, it defaults to `http://localhost:4000`
3. All API calls use this base URL

## Testing the Connection

### 1. Make sure backend is running
```bash
cd Server/mdbx-backend
npm run dev
```

You should see:
```
✅ Database connected successfully!
🚀 MDBX Backend Server Started
📡 Server running on: http://localhost:4000
```

### 2. Start the frontend
```bash
cd Client/MyDewbox
npm run dev
```

### 3. Test API Connection

Open browser console and check for API calls to `http://localhost:4000`

## Available Endpoints

Your backend provides these endpoints:

- **Auth**
  - POST `/auth/register` - Register new user
  - POST `/auth/login` - Login user
  - GET `/auth/check` - Check authentication

- **Users**
  - GET `/users/me` - Get current user
  - GET `/users/subscriber` - Get subscriber info
  - PATCH `/users/profile` - Update profile

- **Transactions**
  - GET `/users/transactions` - Get all transactions
  - POST `/users/transactions/contribute` - Create contribution

- **Banks**
  - GET `/banks` - Get list of banks

## Troubleshooting

### "Network Error" or "ERR_CONNECTION_REFUSED"

**Problem:** Frontend can't connect to backend

**Solutions:**
1. Check backend is running: `npm run dev` in `Server/mdbx-backend`
2. Verify backend is on port 4000
3. Check `.env` file has correct URL
4. Restart frontend dev server after changing `.env`

### CORS Errors

**Problem:** Browser blocks requests due to CORS policy

**Solution:** Backend already has CORS enabled in `src/index.js`:
```javascript
app.use(cors());
```

If you still get CORS errors, update backend to:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
```

### API Returns 404

**Problem:** Endpoint not found

**Solutions:**
1. Check endpoint path in API service matches backend routes
2. Verify backend routes are registered in `src/index.js`
3. Check backend logs for incoming requests

## Environment Variables Reference

### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:4000

# Environment
NODE_ENV=development
```

### Backend (.env)
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_HOST=centerbeam.proxy.rlwy.net
DB_PORT=43916
DB_USERNAME=root
DB_PASSWORD=iaeOhkbVTtbeztnZIcfllCGlWYWhjBFl
DB_NAME=railway

# JWT Configuration
JWT_SECRET=mdbx_super_secret_jwt_key_change_in_production_abc123xyz789
JWT_EXPIRES_IN=7d
```

## Next Steps

1. ✅ Backend is running on port 4000
2. ✅ Frontend is configured to use port 4000
3. ⏳ Start frontend dev server
4. ⏳ Test login/register functionality
5. ⏳ Initialize database schema if not done yet

## Quick Commands

```bash
# Start Backend
cd Server/mdbx-backend
npm run dev

# Start Frontend (in new terminal)
cd Client/MyDewbox
npm run dev

# Test Backend Connection
curl http://localhost:4000
```

## Production Deployment

When deploying to production:

1. Update frontend `.env`:
   ```env
   VITE_API_URL=https://your-backend-url.com
   ```

2. Rebuild frontend:
   ```bash
   npm run build
   ```

3. Deploy backend to Railway/Render/etc.

4. Update backend CORS to allow your frontend domain

5. Use environment variables in production (don't commit `.env`)
