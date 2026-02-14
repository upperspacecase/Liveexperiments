/**
 * OG image scraping utility.
 * No Vercel API token needed — deployment data comes via webhooks.
 */
export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const res = await fetch(fullUrl, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioBot/1.0)" },
    });
    if (!res.ok) return null;

    const html = await res.text();
    // Look for og:image meta tag
    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    if (match?.[1]) return match[1];

    // Try reverse order (content before property)
    const match2 = html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    );
    return match2?.[1] ?? null;
  } catch {
    return null;
  }
}
