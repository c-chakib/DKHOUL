# 🚀 Deploy Frontend to Netlify

## Quick Deploy (3 steps):

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login to Netlify
netlify login

# 3. Deploy
npm run deploy:netlify
```

## Manual Setup:

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Netlify will auto-detect settings from `netlify.toml`
5. Deploy!

## Configuration:

- ✅ **Build Command**: `cd frontend && npm install && npm run build`
- ✅ **Publish Directory**: `frontend/dist/browser`
- ✅ **SPA Routing**: Automatic redirects to `index.html`
- ✅ **Security Headers**: XSS protection, frame options
- ✅ **Asset Caching**: Optimized for performance

## FREE Tier Includes:
- 100GB bandwidth/month
- Custom domain
- SSL certificate
- Global CDN
- Form handling

That's it! Your Angular app will be live in minutes. 🎉