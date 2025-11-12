# Frontend Deployment Guide

This guide shows how to deploy the DKHOUL frontend to various hosting platforms.

## 🚀 Quick Deploy Options

### Option 1: Netlify (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
npm run deploy:netlify
```

### Option 2: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (first time only)
firebase init hosting

# Deploy
npm run deploy:firebase
```

### Option 3: Vercel (Alternative)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📋 Manual Deployment

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/dist/browser`
5. Deploy!

### Firebase
1. Go to [firebase.google.com](https://firebase.google.com)
2. Create a new project
3. Enable Hosting
4. Run: `firebase init hosting`
5. Run: `firebase deploy`

### Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect Angular settings
4. Deploy!

## 🔧 Configuration Files

- `netlify.toml` - Netlify configuration
- `firebase.json` - Firebase configuration
- `vercel.json` - Vercel configuration
- `.firebaserc` - Firebase project configuration (create manually)

## 🌐 Environment Variables

Set these in your hosting platform:

```
NODE_ENV=production
```

## 📝 Notes

- All configurations include proper SPA routing
- Assets are cached for optimal performance
- Security headers are configured
- The app will work with client-side routing