import { client } from "../lib/contentful";
import { Playfair_Display, Inter } from "next/font/google";
import PostCard from "../components/ui/postcard";
export const dynamic = "force-dynamic";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const inter = Inter({ subsets: ["latin"] });

async function getPosts() {
  const response = await client.getEntries({
    content_type: "blog",
    order: ["-fields.publishedDate"] as any,
    include: 2,
  });
  return response.items;
}

export default async function Page() {
  const posts = await getPosts();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FAFAF9",
        fontFamily: inter.style.fontFamily,
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #E5E5E5",
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: playfair.style.fontFamily,
            fontSize: "clamp(2.2rem, 5vw, 3.75rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#111",
            margin: 0,
          }}
        >
          The Blog (automatic update)
        </h1>
        <p
          style={{
            color: "#999",
            marginTop: 10,
            fontSize: 15,
            letterSpacing: "0.01em",
          }}
        >
          Testinggggggggggggggggggggggggggggggggggg
        </p>
      </header>

      {/* Posts grid */}
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          padding: "56px 24px 80px",
        }}
      >
        {posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#bbb" }}>
            <p style={{ fontSize: 18 }}>No posts yet — check back soon.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 32,
            }}
          >
            {posts.map((post: any) => {
              const { title, slug, publishedDate, featuredImage, author } =
                post.fields;
              const imageUrl = featuredImage?.fields?.file?.url ?? null;
              const authorName = author?.fields?.name ?? null;
              const authorPic =
                author?.fields?.picture?.fields?.file?.url ?? null;
              const date = publishedDate
                ? new Date(publishedDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null;

              return (
                <PostCard
                  key={post.sys.id}
                  slug={slug}
                  title={title}
                  date={date}
                  imageUrl={imageUrl}
                  authorName={authorName}
                  authorPic={authorPic}
                  playfairFont={playfair.style.fontFamily}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}