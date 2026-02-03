import type { Metadata } from "next"
import { safeSanityFetch } from "@/lib/sanity.client"
import { SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { Footer } from "@/components/Footer"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Chi Siamo",
  description:
    "Fuocherello è un luogo di incontro nato all'interno della Fonderia Artistica De Carli di Volvera (TO). Uno spazio policentrico dedicato alla scultura e alla sperimentazione artistica.",
  openGraph: {
    title: "Chi Siamo | Fuocherello",
    description:
      "Fuocherello è un luogo di incontro nato all'interno della Fonderia Artistica De Carli di Volvera (TO). Uno spazio policentrico dedicato alla scultura e alla sperimentazione artistica.",
  },
  alternates: {
    canonical: "/about",
    languages: {
      "it-IT": "/about",
      "en-US": "/en/about",
    },
  },
}

const aboutParagraphs = [
  "Fuocherello è un luogo di incontro nato all’interno della Fonderia Artistica De Carli di Volvera (TO).",
  "Con riferimento al gioco tipicamente italiano per bambini, Fuoco-acqua, Fuocherello manifesta l’inseguimento cieco e la quasi-scoperta di qualcosa che stavamo cercando nel mondo dell’arte contemporanea: la scultura.",
  "La caratteristica principale di Fuocherello è la sua natura policentrica e il suo approccio incentrato sulla sperimentazione. La fonderia De Carli è l’innesco, da cui varie micce possono accendersi in diversi luoghi.",
  "La programmazione consente agli artisti di sviluppare le proprie opere direttamente all’interno della fonderia. Avendo come rete di appoggio l’equipe tecnica interna, gli artisti sono liberi di trasformare lo spazio in un ibrido laboratorio-luogo di apprendimento-sede espositiva.",
  "A Fuocherello gli artisti sono liberi di modificare e sviluppare le mostre e le opere, durante l’intera durata della mostra.",
  "Questo permette agli spettatori di vedere ciò che altrimenti sarebbe nascosto, la pratica e l’approccio di un artista al proprio lavoro compresi i ripensamenti e lo scenario che lo forgiano. Lo spazio prende il nome dalla mostra inaugurale dell’artista proveniente dalla Mongolia (classe 94′) Bekhbaatar Enkhtur a cura di Gabriele Tosi.",
]

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function AboutPage() {
  const settings = await getSettings()

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 px-[10px] py-10 md:py-12 pt-24 md:pt-28 pb-28 min-h-screen flex items-center justify-center overflow-y-auto">
        <div className="w-full text-left text-[#0000ff] px-[10px] mx-[10px] page-inline-margins">
          <div className="spacer-10vh" />
          <div className="text-[clamp(24px,6vw,58px)] leading-[1em] space-y-8">
            {aboutParagraphs.map((p, i) => (
              <p key={p}>
                {renderSentencesWithInitials(p)}
                {i === 0 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </p>
            ))}
          </div>
          <div className="spacer-10vh" />
        </div>
      </main>
      <Footer language="it" footerText={settings?.footerText} variant="home" />
    </div>
  )
}

function renderSentencesWithInitials(paragraph: string) {
  // Split into sentences keeping punctuation
  const sentences = paragraph.match(/[^.!?]+[.!?]*/g) || [paragraph]
  return sentences.map((s, idx) => {
    const trimmed = s.trimStart()
    if (!trimmed) return s
    const first = trimmed.charAt(0).toUpperCase()
    const rest = trimmed.slice(1)
    const leadingSpace = s.startsWith(" ") ? " " : ""
    const sentenceContains = (str: string) => trimmed.toLowerCase().includes(str)
    const needsBreak = sentenceContains('sede espositiva')
    return (
      <span key={idx}>
        {leadingSpace}
        <span className="italic uppercase inline-block initial-mr">
          {first}
        </span>
        {renderWordsWithInitials(rest)}
        {idx < sentences.length - 1 ? ' ' : ''}
        {needsBreak && (
          <>
            <br />
            <br />
          </>
        )}
      </span>
    )
  })
}

function renderWordsWithInitials(text: string) {
  const parts = text.split(/(\s+)/)
    return parts.map((part, i) => {
    // match tokens starting with a capital letter followed by letters (names, De, Carli, Bekhbaatar, etc.)
    const m = part.match(/^([A-ZÀ-ÖØ-Þ])([A-Za-zÀ-ÖØ-öø-ÿ'’\-]*)(.*)$/u)
    if (m && m[2]) {
      const first = m[1]
      const rest = m[2] + (m[3] || '')
      // normalize token (strip punctuation) to check for 'Fuocherello'
      const token = (m[1] + m[2]).replace(/[^A-Za-zÀ-ÖØ-öø-ÿ'’\-]/g, '')
      // check previous non-space token to ensure we only break after "A Fuocherello" (or "At Fuocherello")
      let prevToken = ''
      for (let j = i - 1; j >= 0; j--) {
        if (!parts[j].match(/^\s+$/)) {
          prevToken = parts[j]
          break
        }
      }
      const prevNormalized = prevToken.trim().toLowerCase()
      const triggerPrev = prevNormalized === 'a' || prevNormalized === 'at'
      const isFuocherello = token.toLowerCase() === 'fuocherello'
      // if the rest is an all-uppercase acronym (eg. TO), keep it uppercase
      const restIsAllUpper = /^[A-Z]+$/.test(m[2])
      if (isFuocherello && triggerPrev) {
        return (
          <span key={i}>
              <span className="inline-block whitespace-nowrap">
              <span className="italic uppercase inline-block initial-mr">{first}</span>
              <span className={restIsAllUpper ? 'uppercase' : 'lowercase'}>{rest}</span>
            </span>
            <br />
            <br />
          </span>
        )
      }
      return (
        <span key={i} className="inline-block whitespace-nowrap">
          <span className="italic uppercase inline-block initial-mr">{first}</span>
          <span className={restIsAllUpper ? 'uppercase' : 'lowercase'}>{rest}</span>
        </span>
      )
    }
    return <span key={i}>{part}</span>
  })
}
