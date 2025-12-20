import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { SITE_SETTINGS_QUERY } from "@/lib/queries"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { urlFor } from "@/lib/imageUrl"
import Image from "next/image"

export const revalidate = 60

interface SiteSettings {
  title: string
  tagline?: string
  footerText?: string
  homeGallery?: Array<{
    image: any
    alt?: string
    caption?: string
  }>
}

const mockGalleryImages = [
  {
    alt: "Contemporary art gallery space",
    caption: "Our exhibition space",
  },
  {
    alt: "Modern art exhibition display",
    caption: "Contemporary works",
  },
  {
    alt: "Contemporary sculpture on display",
    caption: "Sculptural installations",
  },
  {
    alt: "Visitors viewing art in gallery",
    caption: "Visit our exhibitions",
  },
]

async function getSiteSettings(): Promise<SiteSettings | null> {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnHomePage() {
  const settings = await getSiteSettings()

  const title = settings?.title || "Fuocherello"
  const tagline = settings?.tagline || "Contemporary Art Gallery"
  const gallery = settings?.homeGallery || []

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="en" />
      <main className="flex-1 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {!isSanityAvailable && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              Fallback mode: configure Sanity environment variables to view real content.
            </div>
          )}

          <div className="mb-16 text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-4 italic">{title}</h1>
            <p className="text-xl text-muted-foreground">{tagline}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gallery.length > 0
              ? gallery.map((item, index) => (
                  <div key={index} className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {item.image && (
                      <Image
                        src={urlFor(item.image).width(1200).height(900).url() || "/placeholder.svg"}
                        alt={item.alt || ""}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {item.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-sm">
                        {item.caption}
                      </div>
                    )}
                  </div>
                ))
              : mockGalleryImages.map((image, index) => (
                  <div key={index} className="relative aspect-[4/3] bg-muted overflow-hidden">
                    <Image
                      src={`/ceholder-svg-key-2maz1.jpg?key=2maz1&height=900&width=1200`}
                      alt={image.alt}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-sm">
                      {image.caption}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </main>
      <Footer language="en" footerText={settings?.footerText} />
    </div>
  )
}
