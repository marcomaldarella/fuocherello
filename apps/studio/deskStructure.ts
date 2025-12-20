import type { StructureResolver } from "sanity/structure"

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem().title("Settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      S.divider(),

      S.listItem()
        .title("Exhibitions")
        .child(
          S.list()
            .title("By Language")
            .items([
              S.listItem()
                .title("Italian")
                .child(
                  S.documentTypeList("exhibition")
                    .title("Italian Exhibitions")
                    .filter('_type == "exhibition" && language == "it"'),
                ),
              S.listItem()
                .title("English")
                .child(
                  S.documentTypeList("exhibition")
                    .title("English Exhibitions")
                    .filter('_type == "exhibition" && language == "en"'),
                ),
            ]),
        ),

      S.listItem()
        .title("Fairs")
        .child(
          S.list()
            .title("By Language")
            .items([
              S.listItem()
                .title("Italian")
                .child(
                  S.documentTypeList("fair")
                    .title("Italian Fairs")
                    .filter('_type == "fair" && language == "it"'),
                ),
              S.listItem()
                .title("English")
                .child(
                  S.documentTypeList("fair")
                    .title("English Fairs")
                    .filter('_type == "fair" && language == "en"'),
                ),
            ]),
        ),

      S.listItem()
        .title("Artists")
        .child(
          S.list()
            .title("By Language")
            .items([
              S.listItem()
                .title("Italian")
                .child(
                  S.documentTypeList("artist")
                    .title("Italian Artists")
                    .filter('_type == "artist" && language == "it"'),
                ),
              S.listItem()
                .title("English")
                .child(
                  S.documentTypeList("artist")
                    .title("English Artists")
                    .filter('_type == "artist" && language == "en"'),
                ),
            ]),
        ),

      S.listItem()
        .title("News")
        .child(
          S.list()
            .title("By Language")
            .items([
              S.listItem()
                .title("Italian")
                .child(
                  S.documentTypeList("newsItem")
                    .title("Italian News")
                    .filter('_type == "newsItem" && language == "it"'),
                ),
              S.listItem()
                .title("English")
                .child(
                  S.documentTypeList("newsItem")
                    .title("English News")
                    .filter('_type == "newsItem" && language == "en"'),
                ),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("About Pages")
        .child(
          S.list()
            .title("By Language")
            .items([
              S.listItem()
                .title("Italian")
                .child(S.document().schemaType("aboutPage").documentId("aboutPage-it").title("About (IT)")),
              S.listItem()
                .title("English")
                .child(S.document().schemaType("aboutPage").documentId("aboutPage-en").title("About (EN)")),
            ]),
        ),

      S.listItem()
        .title("Contact Pages")
        .child(
          S.list()
            .title("By Language")
            .items([
              S.listItem()
                .title("Italian")
                .child(S.document().schemaType("contactPage").documentId("contactPage-it").title("Contact (IT)")),
              S.listItem()
                .title("English")
                .child(S.document().schemaType("contactPage").documentId("contactPage-en").title("Contact (EN)")),
            ]),
        ),
    ])
