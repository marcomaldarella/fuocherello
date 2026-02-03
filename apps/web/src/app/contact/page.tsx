import type { Metadata } from "next"
import { safeSanityFetch } from "@/lib/sanity.client"
import { SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { Footer } from "@/components/Footer"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Contatta Fuocherello. Via 25 Aprile, 37 – Volvera (TO) 10040, Italia. Tel: +39 351 3106014. Email: contact@fuocherello.com",
  openGraph: {
    title: "Contatti | Fuocherello",
    description:
      "Contatta Fuocherello. Via 25 Aprile, 37 – Volvera (TO) 10040, Italia. Tel: +39 351 3106014.",
  },
  alternates: {
    canonical: "/contact",
    languages: {
      "it-IT": "/contact",
      "en-US": "/en/contact",
    },
  },
}

const contactLines = ["Via 25 Aprile, 37 – Volvera", "+39 351 3106014", "contact@fuocherello.com"]

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 px-[10px] py-10 md:py-12 pt-24 md:pt-28 pb-28 min-h-screen flex items-center justify-center overflow-y-auto">
        <div className="w-full text-center text-[#0000ff] px-[10px] mx-[10px] page-inline-margins">
          <div className="pt-1-25">
            {/* Render static blocks with the same markup as News/Mostre but with more phone-friendly sizing and non-breaking spaces */}
            <h1 className="text-[#0000ff]  leading-[1em] tracking-[-0.03em] text-[clamp(24px,6vw,58px)] whitespace-nowrap">
              <span className="inline-block whitespace-nowrap">
                <span className="italic uppercase inline-block initial-mr">V</span>
                <span className="lowercase">ia{String.fromCharCode(160)}25{String.fromCharCode(160)}</span>
              </span>
              <span className="inline-block whitespace-nowrap initial-ml-sm">
                <span className="italic uppercase inline-block initial-mr">A</span>
                <span className="lowercase">prile, 37</span>
              </span>
            </h1>

            <h1 className="text-[#0000ff]  leading-[1em] tracking-[-0.03em] text-[clamp(24px,6vw,58px)] whitespace-nowrap">
              <span className="inline-block whitespace-nowrap">
                <span className="italic uppercase inline-block initial-mr">V</span>
                <span className="lowercase">olvera{String.fromCharCode(160)}</span>
              </span>
              <span className="inline-block whitespace-nowrap initial-ml-sm">(
                <span className="italic uppercase inline-block initial-mr-sm">T</span>
                <span className="uppercase">O</span>
              )</span>
            </h1>

            <h1 className="text-[#0000ff]  leading-[1em] tracking-[-0.03em] text-[clamp(24px,6vw,58px)] whitespace-nowrap">
              <span className="inline-block whitespace-nowrap">
                <span className="lowercase">10040{String.fromCharCode(160)}</span>
                <span className="italic uppercase inline-block initial-mr">I</span>
                <span className="lowercase">taly</span>
              </span>
            </h1>

            <h1 className="text-[#0000ff]  leading-[1em] tracking-[-0.03em] text-[clamp(24px,6vw,58px)] whitespace-nowrap">
              <span className="inline-block whitespace-nowrap">+39{String.fromCharCode(160)}351{String.fromCharCode(160)}310{String.fromCharCode(160)}6014</span>
            </h1>

            <h1 className="text-[#0000ff]  leading-[1em] tracking-[-0.03em] text-[clamp(24px,6vw,58px)] whitespace-nowrap">
              <a
                href="mailto:contact@fuocherello.com"
                className="underline-progress pe-auto"
              >
                <span className="inline-block whitespace-nowrap">
                  <span className="italic inline-block initial-mr">c</span>
                  <span className="lowercase">ontact@fuocherello.com</span>
                </span>
              </a>
            </h1>
          </div>
        </div>
      </main>
      <Footer language="it" footerText={settings?.footerText} variant="home" />
    </div>
  )
}
