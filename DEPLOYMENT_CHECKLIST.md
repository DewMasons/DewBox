# 🚀 Deployment Checklist

## Pre-Deployment

### Backend Setup
- [ ] All environment variables configured in `.env`
- [ ] Database credentials updated for production
- [ ] `NODE_ENV=production` set
- [ ] Paystack LIVE API key configured
- [ ] Admin user ID set
- [ ] JWT secret changed from default
- [ ] CORS configured for production frontend URL

### Database
- [ ] Production database created
- [ ] Contribution system setup script run
- [ ] Database verified with verification script
- [ ] Backup strategy in place

### Paystack
- [ ] Business account verified (Registered Business status)
- [ ] Live API keys obtained
- [ ] Webhook URL configured (optional)
- [ ] Test transactions completed
- [ ] Account funded for withdrawals

### Frontend Setup
- [ ] `VITE_API_URL` points to production backend
- [ ] Build tested locally (`npm run build`)
- [ ] Environment variables configured on hosting platform

---

## Deployment Steps

### 1. Backend Deployment (Railway/Heroku)

```bash
# Push to production
git push railway main
# or
git push heroku main

# Run database setup
railway run node scripts/run-contribution-setup.js
# or
heroku run node scripts/run-contribution-setup.js

# Verify
railway run node scripts/verify-contribution-setup.js
```

### 2. Frontend Deployment (Vercel/Netlify)

```bash
# Build
cd Client/MyDewbox
npm run build

# Deploy
vercel --prod
# or
netlify deploy --prod
```

---

## Post-Deployment

### Testing
- [ ] User registration works
- [ ] Login works
- [ ] Deposit (fund wallet) works
- [ ] Contribution (Piggy/ICA) works
- [ ] Withdrawal works (if Paystack verified)
- [ ] Profile update works
- [ ] Transaction history displays
- [ ] Home page shows correct balances

### Monitoring
- [ ] Backend logs accessible
- [ ] Frontend errors tracked
- [ ] Paystack dashboard monitored
- [ ] Database performance checked

### Security
- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled (if applicable)

---

## Production URLs

**Backend**: `https://your-backend-url.com`  
**Frontend**: `https://your-frontend-url.com`  
**Database**: Railway MySQL  
**Payments**: Paystack Live Mode

---

## Emergency Contacts

**Paystack Support**: support@paystack.com | +234 1 888 3888  
**Railway Support**: https://railway.app/help  
**Database Issues**: Check Railway dashboard

---

## Rollback Plan

If deployment fails:

1. **Backend**: Revert to previous Railway deployment
2. **Frontend**: Revert to previous Vercel/Netlify deployment
3. **Database**: Restore from backup
4. **Notify users** of temporary downtime

---

## Success Criteria

✅ All features working  
✅ No critical errors in logs  
✅ Response times < 2s  
✅ Successful test transactions  
✅ Users can register and login  

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Status**: ⬜ Pending | ⬜ In Progress | ⬜ Complete
