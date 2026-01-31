# Add these scripts to package.json

```json
{
  "scripts": {
    // Existing scripts
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",

    // NEW DATABASE SCRIPTS
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:pull": "prisma db pull",
    "db:studio": "prisma studio",
    "db:seed": "ts-node prisma/seed.ts",
    "db:reset": "prisma migrate reset",

    // NEW DEPLOYMENT SCRIPTS
    "deploy": "vercel --prod",
    "deploy:preview": "vercel",

    // NEW SETUP SCRIPT
    "setup": "npm install && npx prisma generate && cp .env.example .env.local",

    // NEW PRODUCTION BUILD
    "build:prod": "prisma generate && next build"
  }
}
```

## Usage

```bash
# First time setup
npm run setup

# Start development
npm run dev

# Database operations
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open database GUI

# Deploy
npm run deploy       # Deploy to production
```
