interface FallbackNoticeProps {
  language: "it" | "en"
}

export function FallbackNotice({ language }: FallbackNoticeProps) {
  if (language === "it") {
    return null
  }

  return (
    <div className="bg-muted text-muted-foreground text-sm py-2 px-4 rounded mb-4">
      Translated content pending. Showing Italian content.
    </div>
  )
}
