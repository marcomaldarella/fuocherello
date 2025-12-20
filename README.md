# Fuocherello - Bilingual Exhibition Website

A production-ready pnpm monorepo featuring a Next.js 14 website with automatic Italian to English translation via Sanity Studio v3.

## Project Structure

```
.
├── apps/
│   ├── web/          # Next.js 14 App Router website
│   └── studio/       # Sanity Studio v3 CMS
├── package.json      # Root workspace configuration
└── pnpm-workspace.yaml
```

## Features

- Bilingual website (IT/EN) with automatic translation
- Next.js 14 App Router with TypeScript
- Sanity Studio v3 with custom schemas
- ISR caching for optimal performance
- Minimal, typographic editorial layout
- Contact form with honeypot protection
- Automatic IT to EN translation on publish

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Sanity account (free at sanity.io)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables (see Environment Setup below)
4. Start development servers:

```bash
pnpm dev
```

This starts both the web app (localhost:3000) and Sanity Studio (localhost:3333) concurrently.

### Development Commands

```bash
# Run both apps in parallel
pnpm dev

# Run individual apps
pnpm dev:web
pnpm dev:studio

# Build all apps
pnpm build

# Build individual apps
pnpm build:web
pnpm build:studio

# Lint all apps
pnpm lint

# Type check all apps
pnpm typecheck
```

## Environment Setup

### Web App (apps/web/.env)

Create `apps/web/.env` (you can start from `apps/web/.env.example`) with:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-03-15
```

### Sanity Studio (apps/studio/.env)

Create `apps/studio/.env` (you can start from `apps/studio/.env.example`) with:

```env
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_API_TOKEN=your-api-token-with-write-access
```

### Getting Sanity Credentials

1. Create a project at [sanity.io](https://sanity.io)
2. Copy your Project ID from the project settings
3. Generate an API token with write permissions
4. Use `production` as your dataset name (or customize)

## Website Routes

### Italian (Primary Language)

- `/` - Home with gallery
- `/esibizioni-e-fiere` - Exhibits listing
- `/esibizioni-e-fiere/[slug]` - Exhibit detail
- `/news` - News listing
- `/about` - About page
- `/contact` - Contact page with form

### English (Auto-translated)

- `/en` - Home
- `/en/exhibits` - Exhibits listing
- `/en/exhibits/[slug]` - Exhibit detail
- `/en/news` - News listing
- `/en/about` - About page
- `/en/contact` - Contact page with form

## Content Management

### Accessing Sanity Studio

1. Start the studio: `pnpm dev:studio`
2. Open http://localhost:3333
3. Sign in with your Sanity account

### Content Types

**Site Settings** (Singleton)
- Site title, tagline
- Instagram URL
- Footer text
- Contact information
- Home gallery images

**Exhibits** (Italian/English)
- Title, slug, type (exhibition/fair)
- Artists line, dates, status
- Featured image and gallery
- Rich text body content

**News Items** (Italian/English)
- Title, dates
- Summary line
- Image and optional external URL

**About Page** (Italian/English)
- Rich text content
- Optional image

**Contact Page** (Italian/English)
- Rich text content

## Automatic Translation

The system automatically translates Italian content to English when published.

### How It Works

1. Create and publish content in Italian
2. The system detects the publish event
3. Automatically creates/updates the English version
4. Translations are marked with metadata to prevent loops

### Setup Instructions

See [apps/studio/AUTO_TRANSLATION.md](apps/studio/AUTO_TRANSLATION.md) for detailed setup instructions.

### Translation Integration

The default implementation uses placeholder translations (`[EN] prefix`). For production:

1. Integrate a translation API (OpenAI, Google Translate, DeepL)
2. Update the `translateText` function in `apps/studio/functions/autoTranslate.ts`
3. Add required API keys to environment variables
4. Deploy functions: `cd apps/studio && sanity functions deploy`

See the AUTO_TRANSLATION.md file for integration examples.

## Fallback Behavior

If English content is not available:
- English routes display Italian content
- A notice indicates "Translated content pending"
- Routes remain functional (no 404 errors)

## Deployment

### Deploying the Web App

**Vercel (Recommended)**

1. Push your code to GitHub
2. Import project in Vercel
3. Set root directory to `apps/web`
4. Add environment variables
5. Deploy

**Manual**

```bash
cd apps/web
pnpm build
pnpm start
```

### Deploying Sanity Studio

**Sanity Cloud (Recommended)**

```bash
cd apps/studio
sanity deploy
```

This deploys your studio to `your-project.sanity.studio`

## Adding New Content Types

1. Create schema file in `apps/studio/schemas/`
2. Add to `apps/studio/schemas/index.ts`
3. Update `apps/studio/deskStructure.ts` for custom desk layout
4. Create GROQ queries in `apps/web/src/lib/queries.ts`
5. Build pages in `apps/web/src/app/`
6. Add to auto-translation if needed

## Contact Form

The contact form includes:
- Honeypot field for spam protection
- Client-side validation
- API route placeholder at `/api/contact`

### Email Integration

To enable email sending:

1. Choose a provider (Resend, SendGrid, SMTP)
2. Add API keys to environment variables
3. Update `apps/web/src/app/api/contact/route.ts`

Example with Resend:

```ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'contact@yourdomain.com',
  to: 'your-email@example.com',
  subject: 'Contact Form Submission',
  html: `<p><strong>Name:</strong> ${name}</p>...`
})
```

## Performance

- ISR caching with 60-second revalidation
- Optimized images via next/image
- Sanity CDN for asset delivery
- Minimal JavaScript bundle

## Customization

### Styling

- Global styles: `apps/web/src/app/globals.css`
- Tailwind config: `apps/web/tailwind.config.js`
- Design tokens in CSS custom properties

### Layout

- Header: `apps/web/src/components/Header.tsx`
- Footer: `apps/web/src/components/Footer.tsx`
- Page templates in `apps/web/src/app/`

## Troubleshooting

**"Document not found" errors**
- Verify Sanity credentials in .env files
- Check dataset name matches in both apps
- Ensure content is published (not draft)

**Translation not working**
- Verify SANITY_API_TOKEN has write permissions
- Check Sanity Functions are deployed
- Review AUTO_TRANSLATION.md setup steps

**Images not loading**
- Verify NEXT_PUBLIC_SANITY_PROJECT_ID is correct
- Check Sanity CDN hostname in next.config.mjs
- Ensure images are uploaded in Sanity Studio

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4
- **CMS**: Sanity Studio v3
- **Content**: Portable Text, GROQ queries
- **Images**: next/image, @sanity/image-url
- **Package Manager**: pnpm workspaces

## License

Private project. All rights reserved.

## Support

For issues or questions:
1. Check this README
2. Review apps/studio/AUTO_TRANSLATION.md
3. Consult [Next.js docs](https://nextjs.org/docs)
4. Consult [Sanity docs](https://www.sanity.io/docs)
