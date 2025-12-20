# Migration Guide: Exhibit → Exhibition/Fair/Artist Split

## Summary

The content structure has been refactored to split the unified `exhibit` schema into three distinct document types:

- **exhibition** (Mostre)
- **fair** (Fiere) 
- **artist** (Artisti)

## Schema Changes

### New Schemas Created

1. **`exhibition.ts`** - For exhibitions/shows
   - All fields from original `exhibit` schema except `type` field
   - No `venue` field

2. **`fair.ts`** - For fairs/events
   - All fields from original `exhibit` schema except `type` field
   - Includes additional `venue` field (string)

3. **`artist.ts`** - For artist profiles
   - Fields: `title` (name), `slug`, `birthYear` (number), `nationality` (string)
   - Includes `gallery` and `body` (biography) fields
   - Supports same translation workflow as other documents

### Schema Registration

Updated `/apps/studio/schemas/index.ts`:
- Added imports for `exhibition`, `fair`, `artist`
- Kept `exhibit` schema for backward compatibility (marked as DEPRECATED)
- All schemas registered in `schemaTypes` array

## Query Changes

### New Queries Added to `/apps/web/src/lib/queries.ts`

**List Queries:**
- `EXHIBITIONS_QUERY` - Fetch all exhibitions
- `FAIRS_QUERY` - Fetch all fairs  
- `EXHIBITIONS_AND_FAIRS_QUERY` - Fetch both (combined, ordered by date desc)
- `ARTISTS_QUERY` - Fetch all artists (ordered by title asc)

**Single Document Queries:**
- `EXHIBITION_BY_SLUG_QUERY` - Single exhibition by slug
- `FAIR_BY_SLUG_QUERY` - Single fair by slug
- `EXHIBITION_OR_FAIR_BY_SLUG_QUERY` - Try both types by slug
- `ARTIST_BY_SLUG_QUERY` - Single artist by slug

**Fallback Queries (EN → IT):**
- `EXHIBITION_OR_FAIR_BY_SLUG_FALLBACK_QUERY`
- `ARTIST_BY_SLUG_FALLBACK_QUERY`

**Deprecated (kept for compatibility):**
- `EXHIBITS_QUERY`
- `EXHIBIT_BY_SLUG_QUERY`
- `EXHIBIT_BY_SLUG_FALLBACK_QUERY`

## Frontend Changes

### Updated Pages

**Italian:**
- `/esibizioni-e-fiere/page.tsx` - Now uses `EXHIBITIONS_AND_FAIRS_QUERY`
- `/esibizioni-e-fiere/[slug]/page.tsx` - Now uses `EXHIBITION_OR_FAIR_BY_SLUG_QUERY`

**English:**
- `/en/exhibits/page.tsx` - Now uses `EXHIBITIONS_AND_FAIRS_QUERY`
- `/en/exhibits/[slug]/page.tsx` - Now uses `EXHIBITION_OR_FAIR_BY_SLUG_QUERY`

### New Pages Created

**Italian:**
- `/artisti/page.tsx` - Artists list page
- `/artisti/[slug]/page.tsx` - Single artist detail page

**English:**
- `/en/artists/page.tsx` - Artists list page  
- `/en/artists/[slug]/page.tsx` - Single artist detail page

### Navigation Updates

Updated `/apps/web/src/components/Header.tsx`:
- Added "Artisti" / "Artists" link to navigation menu

## Interface Changes

Updated interfaces in all affected pages to include:
- `_type?: string` - Document type from Sanity
- `venue?: string` - For fairs only
- Removed or made optional `type: string` field (old enum)

## Migration Strategy

### Phase 1: Preparation (Current State)
✅ New schemas created and registered alongside old schema  
✅ New queries created with old queries marked as deprecated  
✅ Frontend updated to use new queries while maintaining compatibility  
✅ All pages support both old and new data structures via optional fields

### Phase 2: Content Migration (To Be Done in Sanity Studio)

**For each existing `exhibit` document:**

1. **If `type === "exhibition"`:**
   - Create new `exhibition` document
   - Copy all fields except `type`
   - Delete or archive old `exhibit` document

2. **If `type === "fair"`:**
   - Create new `fair` document  
   - Copy all fields except `type`
   - Add `venue` information if available
   - Delete or archive old `exhibit` document

### Phase 3: Cleanup (After Migration Complete)

Once all content is migrated:

1. Remove `exhibit` schema from `/apps/studio/schemas/index.ts`
2. Delete `/apps/studio/schemas/exhibit.ts`
3. Remove deprecated queries from `/apps/web/src/lib/queries.ts`:
   - `EXHIBITS_QUERY`
   - `EXHIBIT_BY_SLUG_QUERY`  
   - `EXHIBIT_BY_SLUG_FALLBACK_QUERY`
4. Clean up optional fields in interfaces (make `_type` required, remove `type`)

## Testing Checklist

- [ ] Verify Sanity Studio loads without errors
- [ ] Create test `exhibition` document
- [ ] Create test `fair` document with venue
- [ ] Create test `artist` document
- [ ] Verify IT pages load: `/esibizioni-e-fiere`, `/artisti`
- [ ] Verify EN pages load: `/en/exhibits`, `/en/artists`
- [ ] Test detail pages with new content types
- [ ] Verify navigation menu includes Artists link
- [ ] Test fallback behavior (EN → IT) for all content types
- [ ] Verify old `exhibit` documents still display correctly during migration

## Notes

- All new schemas support the same translation workflow (IT/EN with `translationOf` reference)
- Artist pages reuse the same `ExhibitHorizontalGallery` component
- Mock data provided for all new pages for fallback/demo purposes
- No breaking changes - all existing content continues to work during migration
