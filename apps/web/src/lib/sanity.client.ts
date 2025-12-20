import { createClient } from "next-sanity"

const isSanityConfigured = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== ""

export const client = isSanityConfigured
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-15",
      useCdn: true,
    })
  : null

export const isSanityAvailable = isSanityConfigured

export async function safeSanityFetch<T>(
  query: string,
  params?: Record<string, any>,
  options?: { next?: { revalidate?: number } },
): Promise<T | null> {
  if (!client) {
    console.log("[v0] Sanity not configured, using fallback content")
    return null
  }

  try {
    const result = await client.fetch<T>(query, params || {}, options)
    return result
  } catch (error) {
    console.error("[v0] Sanity fetch error:", error)
    return null
  }
}
