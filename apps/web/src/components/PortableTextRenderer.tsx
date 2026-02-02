import { PortableText } from "@portabletext/react"
import type { PortableTextBlock } from "@portabletext/types"

interface PortableTextRendererProps {
  value: PortableTextBlock[]
}

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return (
    <div className="prose prose-neutral max-w-none">
      <PortableText
        value={value}
        components={{
          block: {
            h1: ({ children }) => <h1 className="text-4xl  mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-3xl  mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-2xl  mb-2">{children}</h3>,
            normal: ({ children }) => {
              const isEmpty = !children || (Array.isArray(children) && children.every(c => c === '' || c === undefined || c === null))
              if (isEmpty) return <p className="mb-0" style={{ height: '1em' }}>&nbsp;</p>
              return <p className="mb-4 leading-relaxed">{children}</p>
            },
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-border pl-4 italic my-4">{children}</blockquote>
            ),
          },
          marks: {
            link: ({ children, value }) => (
              <a
                href={value?.href}
                className="text-primary underline hover:opacity-70"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
          },
        }}
      />
    </div>
  )
}
