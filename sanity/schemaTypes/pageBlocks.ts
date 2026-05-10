import {defineArrayMember, defineField, defineType} from "sanity";

export const heroBlockType = defineType({
  name: "hero",
  title: "Hero Block",
  type: "object",
  fields: [
    defineField({name: "brandTitle", type: "string"}),
    defineField({
      name: "headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({name: "subheadline", type: "text", rows: 3}),
    defineField({
      name: "cta",
      title: "Call To Action",
      type: "object",
      fields: [
        defineField({name: "label", type: "string"}),
        defineField({name: "href", type: "string"}),
      ],
    }),
    defineField({
      name: "backgroundImage",
      type: "image",
      options: {hotspot: true},
      fields: [defineField({name: "alt", type: "string", title: "Alt text"})],
    }),
  ],
  preview: {
    select: {title: "headline", subtitle: "brandTitle"},
    prepare(selection) {
      return {
        title: selection.title || "Hero",
        subtitle: selection.subtitle,
      };
    },
  },
});

export const galleryBlockType = defineType({
  name: "gallery",
  title: "Gallery Block",
  type: "object",
  fields: [
    defineField({name: "title", type: "string"}),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: {hotspot: true},
          fields: [defineField({name: "alt", type: "string", title: "Alt text"})],
        }),
        defineArrayMember({
          name: "videoItem",
          title: "Video Item",
          type: "object",
          fields: [
            defineField({
              name: "videoUrl",
              title: "Video URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
            defineField({name: "alt", type: "string", title: "Accessibility label"}),
            defineField({
              name: "poster",
              type: "image",
              options: {hotspot: true},
              fields: [defineField({name: "alt", type: "string", title: "Poster alt text"})],
            }),
          ],
          preview: {
            select: {title: "videoUrl"},
            prepare(selection) {
              return {title: selection.title || "Video item"};
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: "title"},
    prepare(selection) {
      return {
        title: selection.title || "Gallery",
      };
    },
  },
});

export const videoBlockType = defineType({
  name: "video",
  title: "Video Block",
  type: "object",
  fields: [
    defineField({name: "title", type: "string"}),
    defineField({name: "embedUrl", type: "url"}),
    defineField({name: "videoUrl", type: "url"}),
  ],
  preview: {
    select: {title: "title"},
    prepare(selection) {
      return {
        title: selection.title || "Video",
      };
    },
  },
});

export const textBlockType = defineType({
  name: "textBlock",
  title: "Text Block",
  type: "object",
  fields: [
    defineField({name: "title", type: "string"}),
    defineField({
      name: "body",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: "title", subtitle: "body"},
    prepare(selection) {
      return {
        title: selection.title || "Text",
        subtitle: selection.subtitle,
      };
    },
  },
});

export const ctaBlockType = defineType({
  name: "cta",
  title: "CTA Block",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: "label", subtitle: "href"},
  },
});

export const aboutBlockType = defineType({
  name: "about",
  title: "About Block",
  type: "object",
  fields: [
    defineField({name: "title", type: "string"}),
    defineField({name: "body", type: "text", rows: 8}),
    defineField({
      name: "image",
      type: "image",
      options: {hotspot: true},
      fields: [defineField({name: "alt", type: "string", title: "Alt text"})],
    }),
    defineField({
      name: "stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({name: "value", type: "string"}),
            defineField({name: "label", type: "string"}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: "title"},
    prepare(selection) {
      return {title: selection.title || "About"};
    },
  },
});

export const contactBlockType = defineType({
  name: "contact",
  title: "Contact Block",
  type: "object",
  fields: [
    defineField({name: "title", type: "string"}),
    defineField({name: "subtitle", type: "string"}),
    defineField({name: "email", type: "string"}),
    defineField({name: "phone", type: "string"}),
    defineField({name: "location", type: "string"}),
    defineField({name: "submitLabel", type: "string"}),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({name: "label", type: "string"}),
            defineField({name: "href", type: "url"}),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: "title"},
    prepare(selection) {
      return {title: selection.title || "Contact"};
    },
  },
});
