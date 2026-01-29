"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center text-[#0000ff] px-6">
        <h1 className="text-[clamp(24px,4vw,48px)] font-normal mb-4">
          <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>Q</span>
          <span className="lowercase">ualcosa è andato storto</span>
        </h1>
        <button
          onClick={() => reset()}
          className="text-[14px] underline hover:opacity-70 transition-opacity"
        >
          Riprova
        </button>
      </div>
    </div>
  )
}
