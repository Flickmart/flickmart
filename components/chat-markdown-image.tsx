import type { Components } from 'react-markdown';

// Shared by every ReactMarkdown-rendered AI reply (NKEM's seller chat and
// the site-wide assistant widget). Both can echo a raw product image URL
// from vector-DB context back as markdown (`![](url)`), which ReactMarkdown
// otherwise renders as a bare <img> at its native resolution -- often far
// larger than a chat bubble should ever show. This caps it to a normal,
// consistent thumbnail size instead.
export const chatMarkdownImageComponents: Components = {
  img: ({ node: _node, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ''}
      className="my-1 max-h-48 w-auto max-w-full rounded-md object-cover"
      loading="lazy"
    />
  ),
};
