# Fuocherello Sanity Studio

Sanity Studio v3 CMS with automatic Italian to English translation.

## Development

```bash
pnpm dev
```

Opens at http://localhost:3333

## Environment Variables

Create `.env` file (you can start from `.env.example`):

```env
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_API_TOKEN=your-api-token
```

## Content Types

- **Site Settings**: Global site configuration
- **Exhibits**: Exhibitions and fairs
- **News Items**: News and announcements
- **About Page**: About content
- **Contact Page**: Contact content

All content types support Italian and English versions.

## Auto-Translation

See [AUTO_TRANSLATION.md](./AUTO_TRANSLATION.md) for setup instructions.

## Deployment

```bash
sanity deploy
```

Deploys to `your-project.sanity.studio`

## Functions

Deploy Sanity Functions for auto-translation:

```bash
sanity functions deploy
