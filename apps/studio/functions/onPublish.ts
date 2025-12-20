import { defineHook } from "@sanity/functions"

export default defineHook({
  name: "onPublish",
  events: ["document.publish"],
  async handler(event, context) {
    const { document } = event

    if (!document) {
      return
    }

    if (document.language !== "it") {
      return
    }

    if (document.translationMeta?.source === "auto-translate") {
      return
    }

    const supportedTypes = ["exhibit", "newsItem", "aboutPage", "contactPage"]
    if (!supportedTypes.includes(document._type)) {
      return
    }

    try {
      await fetch(`${context.functionUrl}/autoTranslate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.token}`,
        },
        body: JSON.stringify({
          sourceDocId: document._id,
          sourceDocType: document._type,
        }),
      })
    } catch (error) {
      console.error("Failed to trigger auto-translation:", error)
    }
  },
})
