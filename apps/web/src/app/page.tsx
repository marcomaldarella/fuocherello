import { safeSanityFetch } from "@/lib/sanity.client"
import { SITE_SETTINGS_QUERY } from "@/lib/queries"
import { Header } from "@/components/Header"
import { BackgroundVideo } from "@/components/BackgroundVideo"
import { Footer } from "@/components/Footer"

export const revalidate = 60

interface SiteSettings {
  title: string
  tagline?: string
  footerText?: string
}

async function getSiteSettings(): Promise<SiteSettings | null> {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function HomePage() {
  const settings = await getSiteSettings()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="it" />
      <BackgroundVideo src="/video-home.mp4" />
      <main className="flex-1 flex items-center justify-center px-6 py-16 relative z-50 pointer-events-none">
        <h1 className="text-[#0000ff] font-black leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)] relative z-50">
          <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>
            F
          </span>
          <span className="lowercase">uocherello</span>
        </h1>
      </main>
      <Footer language="it" footerText={settings?.footerText} variant="home" />
    </div>
  )
}
