import { defineType, defineField } from "sanity"

export default defineType({
  name: "exhibit",
  title: "Exhibit",
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
      to: [{ type: "exhibit" }],
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
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Exhibition", value: "exhibition" },
          { title: "Fair", value: "fair" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "artistsLine",
      title: "Artists Line",
      type: "string",
      description: "Brief line of artists or participants",
    }),
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
      description: "Nome dell'autore dell'articolo della mostra",
    }),
    defineField({
      name: "dateStart",
      title: "Start Date",
      type: "date",
    }),
    defineField({
      name: "dateEnd",
      title: "End Date",
      type: "date",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Upcoming", value: "upcoming" },
          { title: "Current", value: "current" },
          { title: "Past", value: "past" },
        ],
      },
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "image",
              title: "Image",
              type: "image",
              options: {
                hotspot: true,
              },
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
          preview: {
            select: {
              title: "caption",
              media: "image",
            },
          },
        },
      ],
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
  ],
  preview: {
    select: {
      title: "title",
      language: "language",
      type: "type",
      media: "featuredImage",
    },
    prepare(selection) {
      const { title, language, type } = selection
      const langLabel = language === "it" ? "IT" : "EN"
      return {
        ...selection,
        subtitle: `${type} (${langLabel})`,
      }
    },
  },
})
