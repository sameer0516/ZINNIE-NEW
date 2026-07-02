import BlogClient from "./BlogClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function generateStaticParams() {
  try {
    if (!API_URL) return [{ slug: "placeholder" }];
    const res = await fetch(`${API_URL}/api/blogs`, { cache: "no-store" });
    if (!res.ok) return [{ slug: "placeholder" }];
    const blogs = await res.json();
    if (!Array.isArray(blogs) || blogs.length === 0) return [{ slug: "placeholder" }];
    return [{ slug: "placeholder" }, ...blogs.map((b) => ({ slug: b.urlHandle || b.slug }))];
  } catch {
    return [{ slug: "placeholder" }];
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  return <BlogClient slug={slug} />;
}