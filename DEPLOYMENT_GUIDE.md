# NeoBI India v2.0 - Deployment Guide

Complete guide to deploy your production-ready MVP to Vercel in under 10 minutes.

---

## 🚀 Quick Start (5 Minutes)

### 1. Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Database (Vercel Postgres recommended)

### 2. One-Command Deployment

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project directory
cd neobi-india
vercel

# Follow prompts:
# - Link to GitHub? Yes
# - Project name? neobi-india
# - Deploy? Yes
```

That's it! Your app is live at `https://neobi-india.vercel.app`

---

## 📋 Full Deployment Steps

### Step 1: Prepare Your Code

```bash
# 1. Ensure everything is committed
git status
git add .
git commit -m "Ready for production deployment"

# 2. Push to GitHub
git push origin main
```

### Step 2: Set Up Database

#### Option A: Vercel Postgres (Recommended)

1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the connection string
4. Will be auto-added to your project

#### Option B: Supabase (Free Tier)

1. Go to https://supabase.com
2. Create new project
3. Copy connection string from Settings → Database
4. Add to Vercel environment variables

#### Option C: Neon (Serverless Postgres)

1. Go to https://neon.tech
2. Create project
3. Copy connection string
4. Add to Vercel

### Step 3: Configure Environment Variables

1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these required variables:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
FINNHUB_API_KEY=your-finnhub-key
OPENROUTER_API_KEY=your-openrouter-key
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Get API Keys (Free Tiers):**
- FINNHUB_API_KEY: https://finnhub.io/register (60 calls/min free)
- OPENROUTER_API_KEY: https://openrouter.ai/keys ($5 credit free)

### Step 4: Run Database Migrations

```bash
# Install dependencies if needed
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### Step 5: Deploy to Vercel

#### Method 1: Vercel CLI (Fastest)

```bash
vercel --prod
```

#### Method 2: GitHub Integration (Auto-deploy)

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - Framework: Next.js
   - Build Command: `prisma generate && next build`
   - Install Command: `npm install`
4. Click "Deploy"

#### Method 3: Vercel Dashboard

1. Go to Vercel Dashboard
2. Click "Add New" → "Project"
3. Import from GitHub
4. Deploy

### Step 6: Verify Deployment

1. Visit your deployed URL
2. Check these endpoints:
   - `/` - Homepage loads
   - `/api/nifty` - NIFTY data returns
   - `/api/festivals` - Festival data returns
   - `/api/simulate` - Simulation works

---

## 🔧 Post-Deployment Configuration

### 1. Set Up Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs

# Add to Vercel env vars
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-auth-token
```

### 2. Set Up Analytics (Posthog)

```bash
# Install Posthog
npm install posthog-js

# Add to Vercel env vars
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 3. Enable Real NIFTY Data

Set environment variable:
```env
FINNHUB_API_KEY=your-key-here
```

OR

```env
ALPHA_VANTAGE_API_KEY=your-key-here
```

### 4. Enable LLM Router

Set environment variable:
```env
OPENROUTER_API_KEY=your-key-here
LLM_DEFAULT_MODEL=anthropic/claude-3.5-sonnet
LLM_FAST_MODEL=anthropic/claude-3-haiku
```

---

## 🌍 Custom Domain Setup

### 1. Buy Domain (Optional)

- Namecheap, GoDaddy, or any registrar
- Example: `neobi.in` or `yourstartup.com`

### 2. Add to Vercel

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

### 3. Update Environment Variables

```env
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 📊 Monitoring & Performance

### Check Build Logs

```bash
# View recent deployments
vercel ls

# View logs for specific deployment
vercel logs <deployment-url>
```

### Performance Monitoring

1. Vercel Dashboard → Your Project → Analytics
2. View:
   - Response times
   - Error rates
   - Geographic distribution
   - Page views

### Database Monitoring

```bash
# Connect to production database
npx prisma studio --browser none
```

---

## 🔐 Security Checklist

- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] DATABASE_URL is not exposed in client code
- [ ] API keys are in environment variables, not committed
- [ ] .env.local is in .gitignore
- [ ] CORS is configured correctly
- [ ] Rate limiting enabled (Vercel does this by default)

---

## 🐛 Troubleshooting

### Build Fails

**Error: Cannot find module '@prisma/client'**
```bash
# Fix: Ensure build command includes prisma generate
# In vercel.json:
"buildCommand": "prisma generate && next build"
```

**Error: Database connection failed**
```bash
# Fix: Check DATABASE_URL is correct
# Test locally:
npx prisma db pull
```

### Runtime Errors

**Error: NEXTAUTH_SECRET not set**
```bash
# Fix: Add to Vercel environment variables
# Generate new secret:
openssl rand -base64 32
```

**Error: API rate limit exceeded**
```bash
# Fix: Upgrade API plan or implement caching
# NIFTY data is cached for 60s by default
```

### Performance Issues

**Slow API responses**
```bash
# Check Vercel function logs
vercel logs --follow

# Optimize:
# 1. Add database indexes
# 2. Enable API response caching
# 3. Use CDN for static assets
```

---

## 📈 Scaling Guide

### Horizontal Scaling

Vercel auto-scales based on traffic. No configuration needed.

### Database Scaling

**Option 1: Upgrade Database Plan**
- Vercel Postgres: Scale to higher tier
- Supabase: Upgrade to Pro
- Neon: Enable autoscaling

**Option 2: Connection Pooling**

```typescript
// In prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}
```

### Caching Strategy

**Add Redis for LLM response caching:**

```bash
# Install Redis client
npm install @upstash/redis

# Add to Vercel env vars
REDIS_URL=your-upstash-url
REDIS_TOKEN=your-upstash-token
```

---

## 🔄 CI/CD Pipeline

### Automatic Deployments

Vercel automatically deploys on:
- Push to `main` → Production
- Pull Request → Preview deployment

### Preview Deployments

Every PR gets a unique URL:
```
https://neobi-india-git-feature-branch.vercel.app
```

### Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

---

## 💰 Cost Estimate (Monthly)

### Free Tier
- Vercel: Free (Hobby plan)
- Database: Free (Vercel Postgres 512MB)
- NIFTY API: Free (Finnhub 60 calls/min)
- LLM: $5 credit (OpenRouter)
- **Total: $0/month** ✅

### Production (Recommended)
- Vercel Pro: $20/month
- Database: $25/month (Vercel Postgres 2GB)
- Sentry: $26/month (Team plan)
- Posthog: $0 (1M events free)
- LLM: ~$50/month (usage-based)
- **Total: ~$121/month**

### Enterprise
- Vercel Enterprise: $150/month
- Database: $100/month (10GB)
- Sentry: $80/month
- LLM: $200/month
- **Total: ~$530/month**

---

## 📞 Support & Next Steps

### Get Help

- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs

### Week 1 Checklist

- [ ] Deploy to production
- [ ] Set up custom domain
- [ ] Enable error tracking (Sentry)
- [ ] Enable analytics (Posthog)
- [ ] Monitor performance
- [ ] Gather initial user feedback

### Month 1 Roadmap

- [ ] Database optimization (indexes)
- [ ] Real NIFTY API integration
- [ ] LLM router optimization
- [ ] User authentication (NextAuth)
- [ ] Automated testing (Jest + Playwright)
- [ ] Email notifications (Resend)

---

## 🎉 You're Live!

Your NeoBI India v2.0 is now deployed and ready for users!

**Share your app:**
- Tweet about your launch
- Post on LinkedIn
- Share in entrepreneurship communities
- Get feedback from beta users

**Monitor key metrics:**
- Daily active users (DAU)
- API response times
- Error rates
- User feedback

**Keep improving:**
- Weekly deployments
- User feedback incorporation
- Performance optimization
- Feature additions

🚀 **Congratulations on your successful deployment!** 🇮🇳
