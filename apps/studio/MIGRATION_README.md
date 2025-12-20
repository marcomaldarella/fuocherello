# Migrazione Exhibit → Exhibition/Fair

## Preparazione

1. **Crea un token API in Sanity:**
   - Vai su https://sanity.io/manage
   - Seleziona il tuo progetto
   - Vai su **API → Tokens**
   - Clicca "Add API token"
   - Nome: "Migration Script"
   - Permessi: **Editor**
   - Copia il token generato

2. **Imposta il token come variabile d'ambiente:**
   ```bash
   export SANITY_TOKEN="il-tuo-token-qui"
   ```

3. **Imposta project ID e dataset (se necessario):**
   ```bash
   export SANITY_STUDIO_PROJECT_ID="your-project-id"
   export SANITY_STUDIO_DATASET="production"
   ```

## Esecuzione

```bash
cd apps/studio
node migrateExhibits.js
```

## Cosa fa lo script

1. Legge tutti i documenti di tipo `exhibit`
2. Per ogni documento:
   - Se `type === "fair"` → crea un nuovo documento `fair`
   - Altrimenti → crea un nuovo documento `exhibition`
3. Copia tutti i campi (title, slug, gallery, body, ecc.)
4. Mantiene i metadati di traduzione
5. **NON elimina** i vecchi documenti `exhibit`

## Dopo la migrazione

1. Apri Sanity Studio (http://localhost:3333)
2. Verifica che i nuovi documenti in "Exhibitions" e "Fairs" siano corretti
3. Confronta con i vecchi documenti in "Exhibits (Old - Deprecated)"
4. Una volta verificato che tutto funziona:
   - Puoi eliminare manualmente i vecchi documenti `exhibit`
   - Oppure tenerli come backup

## Rollback

Se qualcosa va storto:
1. I vecchi documenti `exhibit` non vengono toccati
2. Puoi eliminare manualmente i nuovi documenti da Sanity Studio
3. Il frontend continua a funzionare con i vecchi documenti tramite `/esibizioni-e-fiere`
