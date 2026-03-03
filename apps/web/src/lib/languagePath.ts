const itToEn: Record<string, string> = {
  "/": "/en",
  "/mostre": "/en/exhibitions",
  "/fiere": "/en/fairs",
  "/artisti": "/en/artists",
  "/news": "/en/news",
  "/about": "/en/about",
  "/contact": "/en/contact",
  "/esibizioni-e-fiere": "/en/exhibits",
}

const enToIt: Record<string, string> = Object.fromEntries(
  Object.entries(itToEn).map(([it, en]) => [en, it])
)

export function getAlternatePath(pathname: string): string {
  const isItalian = !pathname.startsWith("/en")

  if (isItalian) {
    if (itToEn[pathname]) return itToEn[pathname]
    for (const [itBase, enBase] of Object.entries(itToEn)) {
      if (itBase !== "/" && pathname.startsWith(itBase + "/")) {
        return enBase + "/" + pathname.slice(itBase.length + 1)
      }
    }
    return "/en"
  } else {
    if (enToIt[pathname]) return enToIt[pathname]
    for (const [itBase, enBase] of Object.entries(itToEn)) {
      if (enBase !== "/en" && pathname.startsWith(enBase + "/")) {
        return itBase + "/" + pathname.slice(enBase.length + 1)
      }
    }
    return "/"
  }
}
