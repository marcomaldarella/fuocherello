import { defineType, defineField } from "sanity"

export default defineType({
  name: "aboutPage",
  title: "About Page",
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
      to: [{ type: "aboutPage" }],
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
      name: "body",
      title: "Body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      language: "language",
    },
    prepare(selection) {
      const { language } = selection
      const langLabel = language === "it" ? "IT" : "EN"
      return {
        title: `About (${langLabel})`,
      }
    },
  },
})
