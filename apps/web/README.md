# Fuocherello Web App

Next.js 14 web application with bilingual support (IT/EN).

## Development

```bash
pnpm dev
```

Opens at http://localhost:3000

## Environment Variables

Create `.env` file (you can start from `.env.example`):

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-15
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (italian routes)    # IT pages at root
│   ├── en/                 # EN pages under /en
│   └── api/                # API routes
├── components/             # React components
└── lib/                    # Utilities, queries, Sanity client
```

## Key Features

- Server-side data fetching with ISR
- Automatic fallback to Italian for missing EN content
- Responsive images with next/image
- Portable Text rendering
- Contact form with validation

## Build

```bash
pnpm build
pnpm start
```

## Deployment

Deploy to Vercel or any Node.js hosting platform.
