import { defineFunction } from "@sanity/functions"
import { getClient } from "@sanity/functions/client"

interface TranslatePayload {
  sourceDocId: string
  sourceDocType: string
}

export default defineFunction<TranslatePayload>({
  name: "autoTranslate",
  async handler(req, context) {
    const { sourceDocId, sourceDocType } = req.body

    if (!sourceDocId || !sourceDocType) {
      return {
        status: 400,
        body: { error: "Missing sourceDocId or sourceDocType" },
      }
    }

    const client = getClient({ apiVersion: "2024-03-15" })

    try {
      const sourceDoc = await client.fetch(`*[_id == $id][0]`, { id: sourceDocId })

      if (!sourceDoc) {
        return {
          status: 404,
          body: { error: "Source document not found" },
        }
      }

      if (sourceDoc.language !== "it") {
        return {
          status: 400,
          body: { error: "Auto-translation only works for Italian source documents" },
        }
      }

      if (sourceDoc.translationMeta?.source === "auto-translate") {
        return {
          status: 200,
          body: { message: "Skipping auto-generated document to prevent loop" },
        }
      }

      const existingEnDoc = await client.fetch(
        `*[_type == $type && translationOf._ref == $ref && language == "en"][0]`,
        { type: sourceDocType, ref: sourceDocId },
      )

      const translatedFields = await translateFields(sourceDoc, sourceDocType)

      const enDocId = existingEnDoc?._id || `${sourceDocId}-en`

      const enDoc = {
        _id: enDocId,
        _type: sourceDocType,
        language: "en",
        translationOf: {
          _type: "reference",
          _ref: sourceDocId,
        },
        translationMeta: {
          source: "auto-translate",
          lastAutoTranslatedAt: new Date().toISOString(),
        },
        ...translatedFields,
      }

      if (existingEnDoc) {
        await client.patch(enDocId).set(enDoc).commit()
      } else {
        await client.create(enDoc)
      }

      return {
        status: 200,
        body: { message: "Translation successful", enDocId },
      }
    } catch (error: any) {
      console.error("Translation error:", error)
      return {
        status: 500,
        body: { error: error.message || "Translation failed" },
      }
    }
  },
})

async function translateFields(doc: any, docType: string) {
  const translated: any = {}

  if (docType === "exhibit") {
    translated.title = await translateText(doc.title)
    translated.slug = doc.slug
    translated.type = doc.type
    translated.artistsLine = doc.artistsLine ? await translateText(doc.artistsLine) : null
    translated.dateStart = doc.dateStart
    translated.dateEnd = doc.dateEnd
    translated.status = doc.status
    translated.featuredImage = doc.featuredImage
    translated.gallery = doc.gallery
    translated.body = doc.body ? await translatePortableText(doc.body) : null
  } else if (docType === "newsItem") {
    translated.title = await translateText(doc.title)
    translated.dateStart = doc.dateStart
    translated.dateEnd = doc.dateEnd
    translated.dateText = doc.dateText ? await translateText(doc.dateText) : null
    translated.summaryLine = doc.summaryLine ? await translateText(doc.summaryLine) : null
    translated.image = doc.image
    translated.externalUrl = doc.externalUrl
  } else if (docType === "aboutPage") {
    translated.body = doc.body ? await translatePortableText(doc.body) : null
    translated.image = doc.image
  } else if (docType === "contactPage") {
    translated.body = doc.body ? await translatePortableText(doc.body) : null
  }

  return translated
}

async function translateText(text: string): Promise<string> {
  return `[EN] ${text}`
}

async function translatePortableText(blocks: any[]): Promise<any[]> {
  if (!Array.isArray(blocks)) {
    return blocks
  }

  return Promise.all(
    blocks.map(async (block) => {
      if (block._type === "block" && block.children) {
        return {
          ...block,
          children: await Promise.all(
            block.children.map(async (child: any) => {
              if (child._type === "span" && child.text) {
                return {
                  ...child,
                  text: await translateText(child.text),
                }
              }
              return child
            }),
          ),
        }
      }
      return block
    }),
  )
}
