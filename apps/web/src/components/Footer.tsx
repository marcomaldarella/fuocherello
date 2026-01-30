import Link from "next/link"

interface FooterProps {
 language: "it" | "en"
 footerText?: string
 variant?: "default" | "home"
}

export function Footer({ language, footerText, variant = "default" }: FooterProps) {
 const isItalian = language === "it"
 const defaultFooterText = "© 2025"
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
   {/* Pastiglia principale con info */}
   <div
    className="hidden md:block fixed left-4 bottom-4 z-50 py-2.5 px-4 text-[#0000ff] rounded-lg"
    style={glassStyle}
   >
    <div className="flex items-center flex-nowrap">
     <div className="text-sm lowercase">{footerText || defaultFooterText}</div>
     <div className="text-sm text-[#0000ff] flex items-baseline" style={{ marginLeft: "6px" }}>
      <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>F</span>
      <span className="lowercase">uocherello</span>
     </div>
     <span className="text-sm " style={{ margin: "0 8px" }}>–</span>
     <div className="text-sm ">{tagline}</div>
     <a
      href="https://www.instagram.com/fuocherellogallery/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm lowercase text-[#0000ff] hover:opacity-70 transition-opacity"
      style={{ marginLeft: "10px", marginRight: "1em" }}
     >
      instagram
     </a>
    </div>
   </div>

   {/* Pastiglia separata per switch lingua */}
   <div
    className="hidden md:block fixed right-4 bottom-4 z-50 py-2.5 px-4 text-[#0000ff] rounded-lg"
    style={glassStyle}
   >
    <div className="flex items-center gap-3">
     {isItalian ? (
      <>
       <span className="text-sm lowercase text-[#0000ff] px-3 py-1" style={{ opacity: 0.5, pointerEvents: 'none' }}>it</span>
       <Link
        href="/en"
        className="text-sm lowercase text-[#0000ff] hover:opacity-70 transition-opacity px-3 py-1"
       >
        en
       </Link>
      </>
     ) : (
      <>
       <Link
        href="/"
        className="text-sm lowercase text-[#0000ff] hover:opacity-70 transition-opacity px-3 py-1"
       >
        it
       </Link>
       <span className="text-sm lowercase text-[#0000ff] px-3 py-1" style={{ opacity: 0.5, pointerEvents: 'none' }}>en</span>
      </>
     )}
    </div>
   </div>
  </>
 )
}
