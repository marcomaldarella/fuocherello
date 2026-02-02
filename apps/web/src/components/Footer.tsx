import Link from "next/link"

interface FooterProps {
 language: "it" | "en"
 footerText?: string
 variant?: "default" | "home"
}

export function Footer({ language, footerText, variant = "default" }: FooterProps) {
 const isItalian = language === "it"
 const defaultFooterText = "© 2026"
 const tagline = isItalian ? "Galleria d'arte contemporanea." : "Contemporary art gallery."

 const glassStyle = {
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(24px) saturate(180%)",
  WebkitBackdropFilter: "blur(24px) saturate(180%)",
  border: "1px solid rgba(255, 255, 255, 0.5)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.08)",
 }

 return (
  <>
   {/* Footer desktop */}
   <div
    className="hidden md:block fixed left-4 bottom-4 z-50 py-2.5 px-4 text-[#0000ff] text-sm rounded-lg"
    style={glassStyle}
   >
    <div className="flex items-center flex-nowrap">
     {/* Copyright - fixed */}
     <div className="lowercase shrink-0" style={{ paddingRight: "1em" }}>{footerText || defaultFooterText}</div>

     {/* Marquee area */}
     <div className="relative overflow-hidden" style={{ maxWidth: "180px" }}>
      <div
       className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
       style={{ background: "linear-gradient(to right, rgba(255,255,255,0.85), transparent)" }}
      />
      <div
       className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
       style={{ background: "linear-gradient(to left, rgba(255,255,255,0.85), transparent)" }}
      />
      <div className="marquee-track">
       <span className="marquee-content">{tagline}</span>
       <span className="marquee-content">{tagline}</span>
      </div>
     </div>

     {/* Instagram - fixed */}
     <a
      href="https://www.instagram.com/fuocherellogallery/"
      target="_blank"
      rel="noopener noreferrer"
      className="lowercase hover:opacity-70 transition-opacity shrink-0"
      style={{ paddingLeft: "1em", paddingRight: "0.5em" }}
     >
      instagram
     </a>
    </div>
   </div>

   {/* Language switch pill */}
   <div
    className="hidden md:block fixed right-4 bottom-4 z-50 py-2.5 px-6 text-[#0000ff] text-sm rounded-lg"
    style={glassStyle}
   >
    <div className="flex items-center gap-3" style={{ paddingLeft: "0.5em", paddingRight: "0.5em" }}>
     {isItalian ? (
      <>
       <span className="lowercase px-3 py-1" style={{ opacity: 0.5, pointerEvents: 'none' }}>it</span>
       <Link
        href="/en"
        className="lowercase hover:opacity-70 transition-opacity px-3 py-1"
       >
        en
       </Link>
      </>
     ) : (
      <>
       <Link
        href="/"
        className="lowercase hover:opacity-70 transition-opacity px-3 py-1"
       >
        it
       </Link>
       <span className="lowercase px-3 py-1" style={{ opacity: 0.5, pointerEvents: 'none' }}>en</span>
      </>
     )}
    </div>
   </div>
  </>
 )
}
