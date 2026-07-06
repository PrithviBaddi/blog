"use client";

import Link from "next/link";
import { CSSProperties } from "react";

interface PostCardProps {
  slug: string;
  title: string;
  date: string | null;
  imageUrl: string | null;
  authorName: string | null;
  authorPic: string | null;
  playfairFont: string;
}

export default function PostCard({
  slug,
  title,
  date,
  imageUrl,
  authorName,
  authorPic,
  playfairFont,
}: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`} style={{ textDecoration: "none" }}>
      <article
        style={{
          background: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid #EBEBEB",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 8px 32px rgba(0,0,0,0.09)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = "none";
        }}
      >
        {/* Featured image */}
        {imageUrl ? (
          <div
            style={{
              aspectRatio: "16/9",
              overflow: "hidden",
              background: "#F0F0EE",
            }}
          >
            <img
              src={`https:${imageUrl}`}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ) : (
          <div style={{ aspectRatio: "16/9", background: "#F4F4F2" }} />
        )}

        <div
          style={{
            padding: "20px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flex: 1,
          }}
        >
          {date && (
            <time
              style={{
                fontSize: 11,
                color: "#AAA",
                letterSpacing: "0.08em",
                textTransform: "uppercase" as CSSProperties["textTransform"],
                fontWeight: 500,
              }}
            >
              {date}
            </time>
          )}

          <h2
            style={{
              fontFamily: playfairFont,
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#111",
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {title}
          </h2>

          {authorName && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: "auto",
                paddingTop: 16,
                borderTop: "1px solid #F2F2F0",
              }}
            >
              {authorPic && (
                <img
                  src={`https:${authorPic}`}
                  alt={authorName}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
              <span style={{ fontSize: 13, color: "#666", fontWeight: 500 }}>
                {authorName}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}