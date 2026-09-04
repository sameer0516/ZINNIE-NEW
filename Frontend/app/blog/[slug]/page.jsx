import BlogClient from "./BlogClient";

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.zinniezeera.com";

const SITE_URL = "https://zinniezeera.com";

const FETCH_TIMEOUT_MS = 15000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeSlug(slug) {
  if (!slug) return "";
  try {
    return decodeURIComponent(slug).trim().toLowerCase();
  } catch {
    return String(slug).trim().toLowerCase();
  }
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function getAllApiBlogs() {
  if (!API_URL) return [];
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(`${API_URL}/api/blogs`, FETCH_TIMEOUT_MS);
      if (!res.ok) throw new Error(`API responded with status ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * attempt);
    }
  }
  return [];
}

export async function generateStaticParams() {
  try {
    const apiBlogs = await getAllApiBlogs();
    const apiSlugs = apiBlogs
      .map((blog) => blog.urlHandle || blog.slug)
      .filter((slug) => typeof slug === "string" && slug.trim().length > 0)
      .map((slug) => ({ slug: slug.trim() }));

    apiSlugs.push({ slug: "placeholder" });

    const uniqueSlugs = Array.from(
      new Map(apiSlugs.map((item) => [normalizeSlug(item.slug), item])).values()
    );
    return uniqueSlugs;
  } catch (error) {
    return [{ slug: "placeholder" }];
  }
}

async function getBlog(slug) {
  const normalized = normalizeSlug(slug);
  if (!normalized) return null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetchWithTimeout(
        `${API_URL}/api/blogs/${encodeURIComponent(slug)}`,
        FETCH_TIMEOUT_MS
      );
      if (!res.ok) throw new Error(`API responded with status ${res.status}`);
      const data = await res.json();
      if (!data || data.message === "Blog not found") break;
      return data;
    } catch (err) {
      if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY_MS * attempt);
    }
  }

  const apiBlogs = await getAllApiBlogs();
  return apiBlogs.find((blog) => normalizeSlug(blog.urlHandle || blog.slug) === normalized) || null;
}

function getAbsoluteImageUrl(imagePath) {
  if (!imagePath || typeof imagePath !== "string") return null;
  const image = imagePath.trim();
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

function extractJsonLd(rawScript) {
  if (!rawScript || typeof rawScript !== "string") return null;
  let jsonString = rawScript.trim();
  const match = jsonString.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  if (match && match[1]) jsonString = match[1].trim();
  if (!jsonString) return null;
  try {
    JSON.parse(jsonString);
    return jsonString;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) return {};

  const title = blog.pageTitle || blog.title || "Zinnie Blog";
  const description = blog.metaDescription || blog.description || "";
  const absoluteImage = getAbsoluteImageUrl(blog.image);
  const canonicalSlug = blog.urlHandle || blog.slug || slug;

  return {
    title,
    description,
    keywords: blog.keywords || undefined,
    alternates: { canonical: `${SITE_URL}/blog/${canonicalSlug}/` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/blog/${canonicalSlug}/`,
      siteName: "Zinnie",
      images: absoluteImage ? [{ url: absoluteImage, alt: blog.altTag || title }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: absoluteImage ? [absoluteImage] : [],
    },
  };
}

export default async function BlogSlugPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  const jsonLd = blog ? extractJsonLd(blog.script) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      <BlogClient initialBlog={blog} />
    </>
  );
}