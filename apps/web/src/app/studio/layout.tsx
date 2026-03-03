import type { ReactNode } from "react"

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999 }}>
      {children}
    </div>
  )
}
