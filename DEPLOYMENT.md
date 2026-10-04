# Deployment Guide - 2nd Inversion Musical School

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- GitHub account
- Vercel account (recommended for Next.js)
- MongoDB Atlas account (for database)

## Environment Setup

### 1. Local Environment Variables

Create a `.env.local` file in the root directory:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/musical_school
JWT_SECRET=your_jwt_secret_key_here_min_32_characters
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

**Note:** `.env.local` is in `.gitignore` and will not be committed.

### 2. GitHub Secrets Setup

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT authentication secret (min 32 characters) |
| `RAZORPAY_KEY_ID` | Razorpay Key ID (`rzp_test_...` or `rzp_live_...`) |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret. Server only. Never use a `NEXT_PUBLIC_` name. |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret. Server only. |
| `VERCEL_TOKEN` | Vercel deployment token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

#### How to get Vercel credentials:

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click your profile → Settings → Tokens
3. Create a new token and copy it as `VERCEL_TOKEN`
4. In Vercel project settings, find `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`

### 3. MongoDB Setup (Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/musical_school`
4. Add it to GitHub secrets

### 4. Razorpay Setup

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Navigate to Settings → API Keys
3. Copy Test/Live keys
4. Add to GitHub secrets

## Local Development

### Setup Steps

```bash
# 1. Clone repository
git clone https://github.com/Anusaya7/Musical_School.git
cd Musical_School

# 2. Install dependencies
npm install

# 3. Create .env.local file
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Run development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## GitHub CI/CD Pipeline

The workflow file (`.github/workflows/deploy.yml`) automatically:

1. **On Pull Requests**: Builds and lints code
2. **On Push to Main**: Builds, lints, tests, and deploys to Vercel

### Workflow Steps

1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Run linter
5. Build project
6. Deploy to Vercel (production only)

## Deployment to Vercel

### Option 1: Via GitHub Actions (Automatic)

1. Push changes to `main` branch
2. GitHub Actions workflow runs automatically
3. Check GitHub Actions tab for status
4. Deployment goes live on success

### Option 2: Manual Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 3: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com)
2. Import repository
3. Configure environment variables
4. Deploy

## Branch Protection Rules

Recommended settings in GitHub:

1. Go to Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - Require pull request reviews before merging
   - Dismiss stale pull request approvals
   - Require status checks to pass before merging
   - Require branches to be up to date before merging

## Monitoring & Debugging

### GitHub Actions

- View workflow runs: Repository → Actions tab
- Check deployment logs
- Download artifacts if needed

### Vercel Deployment

- View builds: [Vercel Dashboard](https://vercel.com)
- Check build logs
- Monitor errors and performance

### Environment Variables Verification

In Vercel dashboard:
1. Project Settings → Environment Variables
2. Verify all required variables are set
3. Check scopes (development/preview/production)

## Troubleshooting

### Build Fails

- Check GitHub Actions logs
- Verify Node version matches `vercel.json`
- Ensure all dependencies are in `package.json`

### Deployment Fails

- Check Vercel deployment logs
- Verify all secrets are set correctly
- Check MongoDB connection string
- Verify API endpoints are accessible

### Environment Variables Not Loading

- Confirm secrets are added to GitHub
- Check variable names match `.env.example`
- Verify Vercel project environment variables
- Redeploy after adding secrets

## Security Best Practices

1. ✅ Never commit `.env.local`
2. ✅ Use GitHub secrets for sensitive data
3. ✅ Rotate JWT_SECRET periodically
4. ✅ Use strong MongoDB passwords
5. ✅ Enable 2FA on Vercel and GitHub
6. ✅ Use HTTPS for all connections
7. ✅ Keep dependencies updated: `npm audit`

## Rollback Procedure

### If deployment breaks:

```bash
# 1. Revert last commit
git revert HEAD

# 2. Push to trigger new deployment
git push origin main

# OR manually rollback in Vercel:
# Vercel Dashboard → Deployments → Click previous version → Promote
```

## Production Checklist

- [ ] All environment variables set in GitHub secrets
- [ ] MongoDB cluster secured with IP whitelist
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] API rate limiting configured
- [ ] Error monitoring setup (optional: Sentry)
- [ ] Database backups configured
- [ ] Domain properly configured
- [ ] SSL certificate valid
- [ ] Performance monitoring enabled

## Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [GitHub Actions](https://docs.github.com/en/actions)

## Support

For issues or questions:
1. Check GitHub Actions logs
2. Review Vercel deployment logs
3. Consult documentation links above
4. Contact Ajinkya Amrule (Admin)
