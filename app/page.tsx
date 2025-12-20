import { Footer } from "../apps/web/src/components/Footer"
import { Header } from "../apps/web/src/components/Header"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header language="it" />
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <h1 className="text-[#0000ff] font-black leading-[0.85] tracking-[-0.03em] text-[clamp(3.5rem,10vw,8rem)]">
          <span className="italic uppercase inline-block" style={{ marginRight: "0.32em" }}>
            F
          </span>
          <span className="lowercase">uocherello</span>
        </h1>
      </main>
      <Footer language="it" variant="home" />
    </div>
  )
}
