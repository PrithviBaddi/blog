import { client } from "../../../lib/contentful";
export const dynamic = "force-dynamic";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import { notFound } from "next/navigation";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
const inter = Inter({ subsets: ["latin"] });

async function getPost(slug: string) {
  const response = await client.getEntries({
    content_type: "blog",
    "fields.slug": slug,
    include: 2,
    limit: 1,
  } as any);
  return response.items[0] || null;
}

export async function generateStaticParams() {
  const response = await client.getEntries({ content_type: "blog" });
  return response.items.map((item: any) => ({ slug: item.fields.slug }));
}

const richTextOptions = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: any, children: any) => (
      <p
        style={{
          marginBottom: "1.6em",
          lineHeight: 1.85,
          color: "#333",
          fontSize: "1.05rem",
        }}
      >
        {children}
      </p>
    ),
    [BLOCKS.HEADING_2]: (_node: any, children: any) => (
      <h2
        style={{
          fontFamily: playfair.style.fontFamily,
          fontSize: "1.8rem",
          fontWeight: 700,
          margin: "2.5em 0 0.75em",
          color: "#111",
          letterSpacing: "-0.01em",
        }}
      >
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (_node: any, children: any) => (
      <h3
        style={{
          fontFamily: playfair.style.fontFamily,
          fontSize: "1.35rem",
          fontWeight: 600,
          margin: "2em 0 0.6em",
          color: "#111",
        }}
      >
        {children}
      </h3>
    ),
    [BLOCKS.UL_LIST]: (_node: any, children: any) => (
      <ul
        style={{
          paddingLeft: "1.5em",
          marginBottom: "1.6em",
          lineHeight: 1.85,
          color: "#333",
        }}
      >
        {children}
      </ul>
    ),
    [BLOCKS.OL_LIST]: (_node: any, children: any) => (
      <ol
        style={{
          paddingLeft: "1.5em",
          marginBottom: "1.6em",
          lineHeight: 1.85,
          color: "#333",
        }}
      >
        {children}
      </ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node: any, children: any) => (
      <li style={{ marginBottom: "0.4em" }}>{children}</li>
    ),
    [BLOCKS.QUOTE]: (_node: any, children: any) => (
      <blockquote
        style={{
          borderLeft: "3px solid #111",
          paddingLeft: "1.5em",
          margin: "2em 0",
          fontStyle: "italic",
          color: "#555",
          fontFamily: playfair.style.fontFamily,
          fontSize: "1.15rem",
          lineHeight: 1.7,
        }}
      >
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => (
      <hr
        style={{
          border: "none",
          borderTop: "1px solid #E5E5E5",
          margin: "3em 0",
        }}
      />
    ),
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const fields = node.data?.target?.fields;
      if (!fields?.file) return null;
      return (
        <figure style={{ margin: "2.5em 0" }}>
          <img
            src={`https:${fields.file.url}`}
            alt={fields.title || ""}
            style={{ width: "100%", borderRadius: 10, display: "block" }}
          />
          {fields.title && (
            <figcaption
              style={{
                textAlign: "center",
                fontSize: 13,
                color: "#999",
                marginTop: 10,
              }}
            >
              {fields.title}
            </figcaption>
          )}
        </figure>
      );
    },
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a
        href={node.data.uri}
        style={{
          color: "#111",
          textDecoration: "underline",
          textDecorationColor: "#CCC",
          textUnderlineOffset: 3,
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { title, body, publishedDate, featuredImage, author } =
    post.fields as any;

  const imageUrl = featuredImage?.fields?.file?.url;
  const authorName = author?.fields?.name;
  const authorPic = author?.fields?.picture?.fields?.file?.url;
  const date = publishedDate
    ? new Date(publishedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FAFAF9",
        fontFamily: inter.style.fontFamily,
      }}
    >
      {/* Nav */}
      <div
        style={{
          maxWidth: 740,
          margin: "0 auto",
          padding: "28px 24px 0",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 14,
            color: "#888",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            transition: "color 0.15s",
          }}
        >
          ← All posts
        </Link>
      </div>

      {/* Featured image */}
      {imageUrl && (
        <div
          style={{
            maxWidth: 940,
            margin: "28px auto 0",
            padding: "0 24px",
          }}
        >
          <img
            src={`https:${imageUrl}`}
            alt={title}
            style={{
              width: "100%",
              borderRadius: 14,
              maxHeight: 500,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Article */}
      <article
        style={{
          maxWidth: 740,
          margin: "0 auto",
          padding: "44px 24px 96px",
        }}
      >
        {/* Meta */}
        {date && (
          <time
            style={{
              fontSize: 12,
              color: "#AAA",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            {date}
          </time>
        )}

        <h1
          style={{
            fontFamily: playfair.style.fontFamily,
            fontSize: "clamp(2rem, 4.5vw, 3.1rem)",
            fontWeight: 700,
            color: "#111",
            lineHeight: 1.2,
            margin: "12px 0 28px",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>

        {/* Author row */}
        {authorName && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              paddingBottom: 36,
              marginBottom: 36,
              borderBottom: "1px solid #E8E8E6",
            }}
          >
            {authorPic && (
              <img
                src={`https:${authorPic}`}
                alt={authorName}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <span
              style={{ fontSize: 14, fontWeight: 600, color: "#444" }}
            >
              {authorName}
            </span>
          </div>
        )}

        {/* Rich text body */}
        <div>
          {body ? (
            documentToReactComponents(body, richTextOptions)
          ) : (
            <p style={{ color: "#aaa" }}>No content yet.</p>
          )}
        </div>
      </article>
    </main>
  );
}