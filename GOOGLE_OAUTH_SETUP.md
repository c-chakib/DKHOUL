# Google OAuth Setup Guide for Production

## Current Issue
Google OAuth is failing with CORS errors because:
1. Production environment.prod.ts has placeholder: `'YOUR_GOOGLE_CLIENT_ID_HERE'`
2. Google Cloud Console OAuth credentials need production URLs authorized

## Solution Steps

### Step 1: Get Your Google Client ID
1. Go to: https://console.cloud.google.com
2. Select your project (or create one)
3. Navigate to: **APIs & Services** → **Credentials**
4. Find or create an **OAuth 2.0 Client ID** (Application type: Web application)

### Step 2: Configure Authorized URLs in Google Cloud Console
In your OAuth 2.0 Client ID settings:

**Authorized JavaScript origins** (add all):
```
http://localhost:4200
https://dkhoul.me
https://www.dkhoul.me
```

**Authorized redirect URIs** (optional, but recommended):
```
http://localhost:4200
http://localhost:4200/login
https://dkhoul.me
https://www.dkhoul.me
https://dkhoul.me/login
https://www.dkhoul.me/login
```

Click **Save** and wait 5 minutes for changes to propagate.

### Step 3: Update Frontend Production Environment

Edit `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.dkhoul.me/api',
  socketUrl: 'https://api.dkhoul.me',
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY', // Optional - for maps feature
  stripePublicKey: 'pk_test_...', // Your Stripe publishable key
  googleClientId: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com' // ← REPLACE THIS
};
```

### Step 4: Update Backend Environment (Railway)

In Railway Dashboard → Your Service → Variables:

Add/Update:
```
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

### Step 5: Rebuild and Redeploy

**Frontend:**
```bash
cd frontend
npm run build
git add .
git commit -m "Add production Google OAuth Client ID"
git push origin master
```

**Backend:**
Railway will auto-redeploy when you update environment variables.

### Step 6: Test Google OAuth

1. Visit: https://www.dkhoul.me/login
2. Click "Sign in with Google"
3. Should see Google account picker without CORS errors

## Troubleshooting

**If you still see CORS errors:**
- Wait 5-10 minutes after updating Google Cloud Console (propagation delay)
- Clear browser cache and cookies
- Open in incognito/private window
- Check browser console for exact error message

**If Google button doesn't appear:**
- Check browser console for "YOUR_GOOGLE_CLIENT_ID_HERE" error
- Verify environment.prod.ts was updated and rebuilt
- Check Vercel deployment logs to ensure new build deployed

**If "Invalid Google token" error:**
- Verify GOOGLE_CLIENT_ID in Railway matches frontend
- Check Railway logs for Google token verification errors
- Ensure backend GOOGLE_CLIENT_SECRET is set correctly

## Security Notes

- Never commit `.env` files with real credentials
- Use environment variables in production (Railway variables)
- Rotate secrets if accidentally exposed
- Consider restricting OAuth Client ID to specific domains only
