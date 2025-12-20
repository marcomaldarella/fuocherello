import { safeSanityFetch } from "@/lib/sanity.client"
import { SITE_SETTINGS_QUERY } from "@/lib/queries"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export const revalidate = 60

const aboutParagraphs = [
  "Fuocherello is a meeting place born within the De Carli Artistic Foundry in Volvera (TO).",
  "Referencing the classic Italian children’s game “Hot and Cold”, Fuocherello embodies the blind pursuit and near-discovery of something we were looking for in contemporary art: sculpture.",
  "Fuocherello’s main characteristic is its polycentric nature and its experimentation-driven approach. The De Carli foundry is the spark, from which different fuses can ignite in different places.",
  "The program allows artists to develop their works directly inside the foundry. With the internal technical team as a support network, artists are free to transform the space into a hybrid workshop-learning space-exhibition venue.",
  "At Fuocherello, artists are free to modify and develop exhibitions and works throughout the entire duration of the show.",
  "This allows viewers to see what would otherwise remain hidden: the practice and approach of an artist to their work, including second thoughts and the context that shapes it. The space is named after the inaugural exhibition by Mongolian artist (born ’94) Bekhbaatar Enkhtur, curated by Gabriele Tosi.",
]

async function getSettings() {
  return await safeSanityFetch(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnAboutPage() {
  const settings = await getSettings()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="en" fixed />
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
      <Footer language="en" footerText={settings?.footerText} variant="home" />
    </div>
  )
}

function renderSentencesWithInitials(paragraph: string) {
  const sentences = paragraph.match(/[^.!?]+[.!?]*/g) || [paragraph]
  return sentences.map((s, idx) => {
    const trimmed = s.trimStart()
    if (!trimmed) return s
    const first = trimmed.charAt(0).toUpperCase()
    const rest = trimmed.slice(1)
    const leadingSpace = s.startsWith(" ") ? " " : ""
    const sentenceContains = (str: string) => trimmed.toLowerCase().includes(str)
    const needsBreak = sentenceContains('exhibition venue')
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
    const m = part.match(/^([A-ZÀ-ÖØ-Þ])([A-Za-zÀ-ÖØ-öø-ÿ'’\-]*)(.*)$/u)
    if (m && m[2]) {
      const first = m[1]
      const rest = m[2] + (m[3] || '')
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
