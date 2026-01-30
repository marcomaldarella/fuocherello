import { safeSanityFetch } from "@/lib/sanity.client"
import { SITE_SETTINGS_QUERY , SiteSettings } from "@/lib/queries"

import { Footer } from "@/components/Footer"

export const revalidate = 60

const contactLines = ["Via 25 Aprile, 37 – Volvera", "+39 351 3106014", "contact@fuocherello.com"]

async function getSettings() {
  return await safeSanityFetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { revalidate: 60 } })
}

export default async function EnContactPage() {
  const settings = await getSettings()

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <main className="flex-1 px-[1em] py-10 md:py-12 pt-14 md:pt-16 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="mx-auto pt-1-25 mb-2-5">
            <h1 className="text-center text-[#0000ff]  leading-[1em] tracking-[-0.03em] text-[clamp(24px,6vw,58px)]">
              <span className="italic uppercase inline-block initial-mr">V</span>
              <span className="lowercase">ia{String.fromCharCode(160)}25{String.fromCharCode(160)}</span>
              <span className="italic uppercase inline-block initial-mr">A</span>
              <span className="lowercase">prile, 37</span>
            </h1>

            <h1 className="text-center text-[#0000ff]  leading-[1em] tracking-[-0.03em] text-[clamp(24px,6vw,58px)]">
              <span className="italic uppercase inline-block initial-mr">V</span>
              <span className="lowercase">olvera{String.fromCharCode(160)}</span>
              <span className="inline-block initial-ml-sm">(
                <span className="italic uppercase inline-block initial-mr-sm">T</span>
                <span className="uppercase">O</span>
              )</span>
            </h1>

            <h1 className="text-center text-[#0000ff]  leading-[1em] tracking-[-0.03em] text-[clamp(24px,6vw,58px)]">
              <span className="lowercase">10040{String.fromCharCode(160)}</span>
              <span className="italic uppercase inline-block initial-mr">I</span>
              <span className="lowercase">taly</span>
            </h1>

            <h1 className="text-center text-[#0000ff]  leading-[1em] tracking-[-0.03em] text-[clamp(24px,6vw,58px)]">
              <span className="lowercase">+39{String.fromCharCode(160)}351{String.fromCharCode(160)}310{String.fromCharCode(160)}6014</span>
            </h1>

            <h1 className="text-center text-[#0000ff]  leading-[1em] tracking-[-0.03em] text-[clamp(24px,6vw,58px)]">
              <a href="mailto:contact@fuocherello.com" className="underline-progress pe-auto">
                <span>
                  <span className="italic inline-block initial-mr">c</span>
                  <span className="lowercase">ontact@fuocherello.com</span>
                </span>
              </a>
            </h1>
          </div>
        </div>
      </main>
      <Footer language="en" footerText={settings?.footerText} />
    </div>
  )
}
