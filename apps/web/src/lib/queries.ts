export interface SiteSettings {
  title: string
  tagline?: string
  instagramUrl?: string
  footerText?: string
  contact?: {
    address?: string
    phone?: string
    email?: string
  }
  homeGallery?: Array<{
    image: any
    alt?: string
    caption?: string
  }>
}
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  title,
  tagline,
  instagramUrl,
  footerText,
  contact,
  homeGallery[]{
    image,
    alt,
    caption
  }
}`

// DEPRECATED: use EXHIBITIONS_QUERY or FAIRS_QUERY instead
export const EXHIBITS_QUERY = `*[_type == "exhibit" && language == $language] | order(dateStart desc){
  _id,
  title,
  slug,
  type,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  status,
  featuredImage,
  language,
  translationOf
}`

export const EXHIBITIONS_QUERY = `*[_type == "exhibition" && language == $language] | order(dateStart desc){
  _id,
  title,
  slug,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  status,
  featuredImage,
  language,
  translationOf
}`

export const FAIRS_QUERY = `*[_type == "fair" && language == $language] | order(dateStart desc){
  _id,
  title,
  slug,
  venue,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  status,
  featuredImage,
  language,
  translationOf
}`

export const EXHIBITIONS_AND_FAIRS_QUERY = `*[_type in ["exhibition", "fair"] && language == $language] | order(dateStart desc){
  _id,
  _type,
  title,
  slug,
  venue,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  status,
  featuredImage,
  language,
  translationOf
}`

// DEPRECATED: use EXHIBITION_BY_SLUG_QUERY or FAIR_BY_SLUG_QUERY instead
export const EXHIBIT_BY_SLUG_QUERY = `*[_type == "exhibit" && slug.current == $slug && language == $language][0]{
  _id,
  title,
  slug,
  type,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  status,
  featuredImage,
  gallery[]{
    image,
    caption
  },
  body,
  language,
  translationOf
}`

export const EXHIBITION_BY_SLUG_QUERY = `*[_type == "exhibition" && slug.current == $slug && language == $language][0]{
  _id,
  title,
  slug,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  status,
  featuredImage,
  gallery[]{
    image,
    caption
  },
  body,
  language,
  translationOf
}`

export const FAIR_BY_SLUG_QUERY = `*[_type == "fair" && slug.current == $slug && language == $language][0]{
  _id,
  title,
  slug,
  venue,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  status,
  featuredImage,
  gallery[]{
    image,
    caption
  },
  body,
  language,
  translationOf
}`

export const EXHIBITION_OR_FAIR_BY_SLUG_QUERY = `*[_type in ["exhibition", "fair"] && slug.current == $slug && language == $language][0]{
  _id,
  _type,
  title,
  slug,
  venue,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  status,
  featuredImage,
  gallery[]{
    image,
    caption
  },
  body,
  language,
  translationOf
}`

// DEPRECATED: use EXHIBITION_OR_FAIR_BY_SLUG_FALLBACK_QUERY instead
export const EXHIBIT_BY_SLUG_FALLBACK_QUERY = `*[_type == "exhibit" && slug.current == $slug && language == "it"][0]{
  _id,
  title,
  slug,
  type,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  status,
  featuredImage,
  gallery[]{
    image,
    caption
  },
  body,
  language,
  translationOf
}`

export const EXHIBITION_OR_FAIR_BY_SLUG_FALLBACK_QUERY = `*[_type in ["exhibition", "fair"] && slug.current == $slug && language == "it"][0]{
  _id,
  _type,
  title,
  slug,
  venue,
  artistsLine,
  authorName,
  dateStart,
  dateEnd,
  status,
  featuredImage,
  gallery[]{
    image,
    caption
  },
  body,
  language,
  translationOf
}`

export const NEWS_QUERY = `*[_type == "newsItem" && language == $language] | order(date desc){
  _id,
  title,
  date,
  summaryLine,
  image,
  externalUrl,
  language,
  translationOf
}`

export const HOME_CANVAS_IMAGES_QUERY = `*[_type in ["exhibition", "fair"] && language == "it" && defined(gallery)]{
  gallery[]{
    "url": image.asset->url,
    "width": image.asset->metadata.dimensions.width,
    "height": image.asset->metadata.dimensions.height
  }
}.gallery[]`

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage" && _id == $docId][0]{
  _id,
  body,
  image,
  language,
  translationOf
}`

export const ABOUT_PAGE_FALLBACK_QUERY = `*[_type == "aboutPage" && _id == "aboutPage-it"][0]{
  _id,
  body,
  image,
  language,
  translationOf
}`

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage" && _id == $docId][0]{
  _id,
  body,
  language,
  translationOf
}`

export const CONTACT_PAGE_FALLBACK_QUERY = `*[_type == "contactPage" && _id == "contactPage-it"][0]{
  _id,
  body,
  language,
  translationOf
}`

export const ARTISTS_QUERY = `*[_type == "artist" && language == $language] | order(title asc){
  _id,
  title,
  slug,
  featuredImage,
  language,
  translationOf
}`

export const ARTIST_BY_SLUG_QUERY = `*[_type == "artist" && slug.current == $slug && language == $language][0]{
  _id,
  title,
  slug,
  bio,
  gallery[]{
    asset,
    orientation,
    alt
  },
  "pdfUrl": pdfFile.asset->url,
  featuredImage,
  language,
  translationOf
}`

export const ARTIST_BY_SLUG_FALLBACK_QUERY = `*[_type == "artist" && slug.current == $slug && language == "it"][0]{
  _id,
  title,
  slug,
  bio,
  gallery[]{
    asset,
    orientation,
    alt
  },
  "pdfUrl": pdfFile.asset->url,
  featuredImage,
  language,
  translationOf
}`
