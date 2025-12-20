import { defineType, defineField } from "sanity"

export default defineType({
  name: "newsItem",
  title: "News Item",
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
      to: [{ type: "newsItem" }],
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
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "Data dell'elemento news",
    }),

    defineField({
      name: "summaryLine",
      title: "Summary Line",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description: "Optional link to external page",
    }),
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
      media: "image",
    },
    prepare(selection) {
      const { title, language } = selection
      const langLabel = language === "it" ? "IT" : "EN"
      return {
        ...selection,
        subtitle: langLabel,
      }
    },
  },
})
