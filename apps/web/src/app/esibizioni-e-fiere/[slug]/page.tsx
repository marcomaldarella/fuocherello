import { safeSanityFetch, isSanityAvailable } from "@/lib/sanity.client"
import { EXHIBITION_OR_FAIR_BY_SLUG_QUERY, SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"
import { Header } from "@/components/Header"
import { PortableTextRenderer } from "@/components/PortableTextRenderer"
import Link from "next/link"
import { ExhibitHorizontalGallery } from "@/components/ExhibitHorizontalGallery"
export const revalidate = 60

interface Exhibit {
  _id: string
  _type?: string
  title: string
  type?: string
  venue?: string
  artistsLine?: string
  dateStart?: string
  dateEnd?: string
  featuredImage?: any
  gallery?: Array<{
    image: any
    caption?: string
  }>
  body?: any
}

const mockExhibit: Exhibit = {
  _id: "mock-exhibit",
  _type: "exhibition",
  title: "Arte Contemporanea Italiana",
  artistsLine: "Marco Rossi, Laura Bianchi, Giuseppe Verdi",
  dateStart: "2024-03-01",
  dateEnd: "2024-04-30",
  body: [
    {
      _type: "block",
      children: [
        {
          _type: "span",
          text: "Una selezione curata delle opere più significative dell'arte contemporanea italiana, che esplora tematiche attuali attraverso linguaggi visivi innovativi.",
        },
      ],
    },
  ],
}

async function getExhibit(slug: string): Promise<Exhibit | null> {
  const result = await safeSanityFetch<Exhibit>(
    EXHIBITION_OR_FAIR_BY_SLUG_QUERY,
    { slug, language: "it" },
    { next: { revalidate: 60 } },
  )
  return result
}

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function ExhibitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [exhibit, settings] = await Promise.all([getExhibit(slug), getSettings()])

  const displayExhibit = exhibit || (!isSanityAvailable ? mockExhibit : null)

  if (!displayExhibit) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header language="it" />
        <main className="flex-1 px-6 py-16">
          <div className="w-screen">
            <p>Esibizione non trovata.</p>
          </div>
        </main>
        {/* Footer rimosso anche nello stato di not found */}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="it" />
      <main className="flex-1 px-0 py-0">
        <div className="w-screen">
          {!isSanityAvailable && (
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              Modalità fallback: configura le variabili d'ambiente di Sanity per visualizzare contenuti reali.
            </div>
          )}

          <ExhibitHorizontalGallery
            title={displayExhibit.title}
            authorName={(displayExhibit as any).authorName}
            artistsLine={displayExhibit.artistsLine}
            dateStart={displayExhibit.dateStart}
            dateEnd={displayExhibit.dateEnd}
            featuredImage={displayExhibit.featuredImage}
            gallery={displayExhibit.gallery}
            body={displayExhibit.body}
            language="it"
          />

          {/* Testo ora incluso come ultima slide nella galleria (mobile: scroll verticale) */}

          {/* Back "x" centralizzato nel ExhibitInfoDrawer per inline con info */}
        </div>
      </main>
      {/* Footer rimosso nelle pagine galleria */}
    </div>
  )
}
