# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Update Production Environment Variables
Edit `.env.production` and set your production API URL:
```
REACT_APP_API_URL=https://your-production-api-url.com/api/v1
```

### 2. Push Code to Git Repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add Environment Variables:
   - Key: `REACT_APP_API_URL`
   - Value: Your production API URL
6. Click "Deploy"

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 4. Configure Custom Domain (Optional)
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Environment Variables in Vercel
Add these in Project Settings > Environment Variables:
- `REACT_APP_API_URL` - Your production API URL

## Important Notes
- The `.env` file is for local development only
- `.env.production` is used during build for production
- Never commit sensitive API keys to Git
- Vercel automatically rebuilds on Git push

## Troubleshooting
- If routes don't work, check `vercel.json` configuration
- For API connection issues, verify `REACT_APP_API_URL` in Vercel settings
- Check build logs in Vercel dashboard for errors
