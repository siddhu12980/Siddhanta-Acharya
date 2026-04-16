import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import { Callout } from "@/components/mdx/callout";
import { CodeBlock } from "@/components/mdx/code-block";

const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },
  keepBackground: false,
};

const components = {
  Callout,
  CodeBlock,
  // Standard element overrides for MDX rendering
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="overflow-x-auto rounded-sm border border-app-border bg-app-panel p-4 font-mono text-sm"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => {
    // Inline code (not inside a pre block — rehype-pretty-code wraps code blocks differently)
    if (!props.className?.includes("language-")) {
      return (
        <code
          className="rounded-sm bg-app-hover px-1 py-0.5 font-mono text-sm"
          {...props}
        />
      );
    }
    return <code {...props} />;
  },
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="my-4 border-l-2 border-app-accent pl-4 italic text-app-text-secondary"
      {...props}
    />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-app-accent underline underline-offset-4 transition-colors hover:text-app-accent-hover"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mb-3 mt-8 text-xl font-sans font-semibold text-app-text"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="mb-2 mt-6 text-lg font-sans font-semibold text-app-text"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="my-3 leading-relaxed" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="my-3 ml-6 list-disc space-y-1" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="my-3 ml-6 list-decimal space-y-1" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
};

export async function renderMDX(source: string) {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      parseFrontmatter: false, // we parse frontmatter separately via gray-matter
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }],
          [rehypePrettyCode, prettyCodeOptions],
        ],
      },
    },
  });

  return content;
}
