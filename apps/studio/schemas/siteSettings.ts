import { defineType, defineField } from "sanity"

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "contact",
      title: "Contact Information",
      type: "object",
      fields: [
        {
          name: "address",
          title: "Address",
          type: "text",
          rows: 2,
        },
        {
          name: "phone",
          title: "Phone",
          type: "string",
        },
        {
          name: "email",
          title: "Email",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "homeGallery",
      title: "Home Gallery Images",
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
              name: "alt",
              title: "Alt Text",
              type: "string",
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
          preview: {
            select: {
              title: "alt",
              media: "image",
            },
          },
        },
      ],
    }),
  ],
})
