import { createImageUrlBuilder } from "@sanity/image-url"
import { client } from "./sanity.client"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

const builder = client ? createImageUrlBuilder(client) : null

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    throw new Error("Sanity is not configured: cannot build image URLs.")
  }
  return builder.image(source)
}
