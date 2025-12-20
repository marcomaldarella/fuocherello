"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import styles from "./Header.module.css"

interface HeaderProps {
  language: "it" | "en"
  fixed?: boolean
}

export function Header({ language, fixed = false }: HeaderProps) {
  const isItalian = language === "it"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const links = isItalian
    ? [
      { href: "/mostre", label: "Mostre" },
      { href: "/fiere", label: "Fiere" },
      { href: "/artisti", label: "Artisti" },
      { href: "/news", label: "news" },
      { href: "/about", label: "Informazioni" },
      { href: "/contact", label: "Contatti" },
    ]
    : [
      { href: "/en/exhibitions", label: "Exhibitions" },
      { href: "/en/fairs", label: "Fairs" },
      { href: "/en/artists", label: "Artists" },
      { href: "/en/news", label: "news" },
      { href: "/en/about", label: "About" },
      { href: "/en/contact", label: "Contact" },
    ]

  const headerClass = fixed
    ? "fixed top-0 left-0 right-0 py-3 md:py-4 px-3 md:px-4 bg-white z-50"
    : "py-3 md:py-4 px-3 md:px-4 bg-white relative z-50"

  return (
    <>
      {/* Desktop Header */}
      <header className={`${headerClass} hidden md:block ${styles.desktopHeader}`}>
        <nav className="w-screen flex flex-wrap items-center justify-between">
          <Link href={isItalian ? "/" : "/en"} className={`flex items-center gap-2 h-8 ${styles.logoLink}`}>
            <Image
              src="/fuocherello.gif"
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              unoptimized
              className="w-4.5 h-4.5 md:w-[calc(var(--spacing)*8)] md:h-[calc(var(--spacing)*8)] relative top-[-1px]"
            />
          </Link>
          <ul className={`flex flex-wrap items-center justify-end md:justify-between w-full md:w-1/2 gap-4 md:gap-10 lg:gap-12 text-[14px] ${styles.navList}`}>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`hover:opacity-70 transition-opacity text-[14px] font-black lowercase ${styles.navLink}`}
                >
                  <span className={`inline-block italic uppercase ${styles.navLinkFirstLetter}`}>{link.label[0]}</span>
                  <span className="lowercase">{link.label.slice(1)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile Menu Button - Bottom Fixed */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white py-3 px-[10px] flex items-center justify-between z-50 ${styles.mobileMenuButton}`}>
        <Link href={isItalian ? "/" : "/en"} className={`flex items-center ${styles.logoLink}`}>
          <Image
            src="/fuocherello.gif"
            alt=""
            aria-hidden="true"
            width={30}
            height={30}
            unoptimized
            className={`w-[30px] h-[30px] ${styles.mobileMenuButtonGif}`}
          />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`text-[16px] font-black lowercase text-[#0000ff] hover:opacity-70 transition-opacity ${styles.menuButton}`}
        >
          <span className={`inline-block italic uppercase ${styles.menuButtonFirstLetter}`}>M</span>
          <span className="lowercase">enu</span>
        </button>
      </div>

      {/* Mobile Full Screen Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${styles.mobileMenuContainer}`}>
          <div className={styles.mobileMenuInner}>
            <ul className={styles.mobileMenuList}>
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-[24px] font-black hover:opacity-70 transition-opacity block ${styles.mobileMenuLink}`}
                  >
                    <span className={`inline-block italic uppercase ${styles.mobileMenuLinkFirstLetter}`}>{link.label[0]}</span>
                    <span className="lowercase">{link.label.slice(1)}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Spacer About section mobile */}
            <div className={styles.mobileMenuAboutSpacer}></div>

            {/* Footer content in mobile menu */}
            <div className={`flex flex-col gap-0 text-[16px] font-black text-[#0000ff] ${styles.mobileFooter}`}>
              <div className={`flex items-baseline ${styles.mobileFooterItem}`}>
                <span className={`italic uppercase inline-block ${styles.mobileFooterFirstLetter}`}>F</span>
                <span className="lowercase">uocherello</span>
              </div>
              <div className={styles.mobileFooterItem}>{isItalian ? "Galleria d'arte contemporanea." : "Contemporary art gallery."}</div>
              
              {/* Bottom row with 3 columns */}
              <div className={styles.mobileFooterGrid}>
                <div className={styles.mobileFooterItem}>© 2025</div>
                <a
                  href="https://www.instagram.com/fuocherellogallery/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:opacity-70 transition-opacity lowercase ${styles.mobileFooterItem} ${styles.mobileFooterGridCenter}`}
                >
                  instagram
                </a>
                <div className={`${styles.mobileFooterItem} ${styles.mobileFooterGridRight}`}>
                  {isItalian ? (
                    <>
                      <span className={styles.languageInactive}>it</span>
                      <Link href="/en" className="hover:opacity-70 transition-opacity">en</Link>
                    </>
                  ) : (
                    <>
                      <Link href="/" className="hover:opacity-70 transition-opacity">it</Link>
                      <span className={styles.languageInactive}>en</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`text-[16px] font-black text-[#0000ff] hover:opacity-70 transition-opacity ${styles.closeButton}`}
            >
              <span className={`inline-block italic uppercase ${styles.closeButtonFirstLetter}`}>C</span>
              <span className="lowercase">lose</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
