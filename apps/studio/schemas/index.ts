import siteSettings from "./siteSettings"
import exhibit from "./exhibit" // DEPRECATED: use exhibition/fair instead
import exhibition from "./exhibition"
import fair from "./fair"
import artist from "./artist"
import newsItem from "./newsItem"
import aboutPage from "./aboutPage"
import contactPage from "./contactPage"

export const schemaTypes = [
  siteSettings,
  exhibition,
  fair,
  artist,
  exhibit, // Keep for migration purposes
  newsItem,
  aboutPage,
  contactPage,
]
