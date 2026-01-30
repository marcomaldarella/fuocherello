import { defineType, defineField } from "sanity"

export default defineType({
  name: "artist",
  title: "Artist",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "Italian", value: "it" },
          { title: "English", value: "en" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "translationOf",
      title: "Translation Of",
      type: "reference",
      to: [{ type: "artist" }],
      description: "Reference to the Italian version (only for EN documents)",
      hidden: ({ document }) => document?.language !== "en",
    }),
    defineField({
      name: "translationMeta",
      title: "Translation Metadata",
      type: "object",
      fields: [
        {
          name: "source",
          title: "Source",
          type: "string",
          options: {
            list: [
              { title: "Manual", value: "manual" },
              { title: "Auto-translate", value: "auto-translate" },
            ],
          },
        },
        {
          name: "lastAutoTranslatedAt",
          title: "Last Auto Translated At",
          type: "datetime",
        },
      ],
      readOnly: true,
    }),
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "text",
      rows: 10,
      description: "Brief biography of the artist",
    }),
    defineField({
      name: "authorName",
      title: "Text Author",
      type: "string",
      description: "Nome dell'autore del testo biografico",
    }),
    defineField({
      name: "gallery",
      title: "Gallery (3 images: 2 square + 1 horizontal)",
      type: "array",
      validation: (Rule) => Rule.max(3),
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "orientation",
              title: "Orientation",
              type: "string",
              options: {
                list: [
                  { title: "Square", value: "square" },
                  { title: "Horizontal", value: "horizontal" },
                ],
                layout: "radio",
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
            },
          ],
        },
      ],
      description: "Upload 3 images: 2 square format, 1 horizontal format",
    }),
    defineField({
      name: "pdfFile",
      title: "PDF File",
      type: "file",
      options: {
        accept: ".pdf",
      },
      description: "Artist's portfolio or CV (PDF)",
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image (for listing page)",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
      media: "featuredImage",
    },
    prepare(selection) {
      const { title, language } = selection
      const langLabel = language === "it" ? "IT" : "EN"
      return {
        ...selection,
        subtitle: `Artist (${langLabel})`,
      }
    },
  },
})
