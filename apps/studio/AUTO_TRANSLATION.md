# Auto-Translation Setup

This Sanity project includes automatic IT -> EN translation using Sanity Functions.

## How It Works

1. When an Italian document is published, the `onPublish` hook triggers
2. The hook calls the `autoTranslate` function
3. The function creates or updates the corresponding English document
4. Translation metadata is added to prevent infinite loops

## Setup

### 1. Install Sanity Functions

```bash
cd apps/studio
npm install @sanity/functions
```

### 2. Configure Environment Variables

Add to `apps/studio/.env`:

```
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
SANITY_API_TOKEN=your-api-token-with-write-access
```

### 3. Deploy Functions

```bash
cd apps/studio
sanity functions deploy
```

### 4. Enable Hooks

In your Sanity project dashboard:
1. Go to API settings
2. Enable Webhooks
3. Add webhook for document.publish events
4. Point to your deployed function URL

## Translation Logic

The current implementation uses placeholder translations with `[EN]` prefix. 

### Integration Options

Replace the `translateText` function in `functions/autoTranslate.ts` with:

#### Option 1: Sanity Agent Actions Translate

```ts
import { translate } from '@sanity/agent-actions'

async function translateText(text: string): Promise<string> {
  const result = await translate({
    text,
    from: 'it',
    to: 'en',
  })
  return result.translation
}
```

#### Option 2: OpenAI

```ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function translateText(text: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'Translate from Italian to English. Preserve tone and meaning.',
      },
      {
        role: 'user',
        content: text,
      },
    ],
  })
  return response.choices[0].message.content || text
}
```

#### Option 3: Google Translate API

```ts
import { Translate } from '@google-cloud/translate/v2'

const translate = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
})

async function translateText(text: string): Promise<string> {
  const [translation] = await translate.translate(text, {
    from: 'it',
    to: 'en',
  })
  return translation
}
```

## Supported Document Types

- exhibit
- newsItem
- aboutPage
- contactPage

## Loop Prevention

The system prevents infinite loops by:
1. Checking if `translationMeta.source === "auto-translate"`
2. Only translating documents with `language === "it"`
3. Setting translation metadata on generated documents

## Manual Override

To manually edit an English document without it being overwritten:
1. Edit the English document in Sanity Studio
2. The system will respect manual edits
3. Or temporarily disable the webhook
