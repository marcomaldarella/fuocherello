import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { schemaTypes } from "../studio/schemas"

export default defineConfig({
  name: "default",
  title: "Fuocherello",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
