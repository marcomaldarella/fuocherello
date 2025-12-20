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

  if (variant === "home") {
    return (
      <footer className="hidden md:block fixed left-0 right-0 bottom-0 bg-white z-50 py-4 text-[#0000ff]">
        <div
          className="flex items-center justify-between"
          style={{
            gap: "10px",
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            paddingLeft: "10px",
            paddingRight: "10px",
          }}
        >
          <div className="flex items-center flex-nowrap">
            <div className="text-sm font-black lowercase">{footerText || defaultFooterText}</div>
            <div className="text-sm font-black text-[#0000ff] flex items-baseline" style={{ marginLeft: "6px" }}>
              <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>F</span>
              <span className="lowercase">uocherello</span>
            </div>
            <span className="text-sm font-black" style={{ margin: "0 8px" }}>–</span>
            <div className="text-sm font-black">{tagline}</div>
            <a
              href="https://www.instagram.com/fuocherellogallery/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-black lowercase text-[#0000ff] hover:opacity-70 transition-opacity"
              style={{ marginLeft: "10px" }}
            >
              instagram
            </a>
          </div>
          <div className="flex items-center gap-3">
            {isItalian ? (
              <>
                <span className="text-sm font-black lowercase text-[#0000ff]" style={{ opacity: 0.5, pointerEvents: 'none' }}>it</span>
                <Link
                  href="/en"
                  className="text-sm font-black lowercase text-[#0000ff] hover:opacity-70 transition-opacity"
                >
                  en
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="text-sm font-black lowercase text-[#0000ff] hover:opacity-70 transition-opacity"
                >
                  it
                </Link>
                <span className="text-sm font-black lowercase text-[#0000ff]" style={{ opacity: 0.5, pointerEvents: 'none' }}>en</span>
              </>
            )}
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className="hidden md:block py-8 mt-16 text-[#0000ff]"
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      <div className="flex items-center flex-wrap justify-between" style={{ gap: "10px" }}>
        <div className="flex items-center flex-nowrap">
          <div className="text-sm font-black lowercase">{footerText || defaultFooterText}</div>
          <div className="text-sm font-black text-[#0000ff] flex items-baseline" style={{ marginLeft: "6px" }}>
            <span className="italic uppercase inline-block" style={{ marginRight: "0.07em" }}>F</span>
            <span className="lowercase">uocherello</span>
          </div>
          <span className="text-sm font-black" style={{ margin: "0 8px" }}>–</span>
          <div className="text-sm font-black">{tagline}</div>
          <a
            href="https://www.instagram.com/fuocherellogallery/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-black lowercase text-[#0000ff] hover:opacity-70 transition-opacity"
            style={{ marginLeft: "10px" }}
          >
            instagram
          </a>
        </div>
        <div className="flex items-center gap-3">
          {isItalian ? (
            <>
              <span className="text-sm font-black lowercase text-[#0000ff]" style={{ opacity: 0.5, pointerEvents: 'none' }}>it</span>
              <Link
                href="/en"
                className="text-sm font-black lowercase text-[#0000ff] hover:opacity-70 transition-opacity"
              >
                en
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="text-sm font-black lowercase text-[#0000ff] hover:opacity-70 transition-opacity"
              >
                it
              </Link>
              <span className="text-sm font-black lowercase text-[#0000ff]" style={{ opacity: 0.5, pointerEvents: 'none' }}>en</span>
            </>
          )}
        </div>
      </div>
    </footer>
  )
}
