import Parser from "rss-parser";
import { NewsItem } from "@/types/artist-data";

// Initialize parser
const parser = new Parser();

export async function getNews(): Promise<NewsItem[]> {
  const feedsEnv = process.env.RSS_FEEDS;
  if (!feedsEnv) {
    console.warn("RSS_FEEDS is missing. Skipping RSS news.");
    return [];
  }

  const feedUrls = feedsEnv.split(",").map((s) => s.trim()).filter(Boolean);
  
  // Fetch all feeds in parallel
  const feedPromises = feedUrls.map(async (url) => {
    try {
      const feed = await parser.parseURL(url);
      return feed.items.map((item) => ({
        title: item.title || "No Title",
        date: item.isoDate || item.pubDate || new Date().toISOString(),
        source: feed.title || "Unknown Source",
        url: item.link || "",
        summary: item.contentSnippet || item.content || "",
      }));
    } catch (error) {
      console.error(`Failed to parse RSS feed: ${url}`, error);
      return [];
    }
  });

  const results = await Promise.all(feedPromises);
  
  // Flatten results
  const allItems = results.flat();

  // Deduplicate by URL
  const seenUrls = new Set<string>();
  const uniqueItems: NewsItem[] = [];

  for (const item of allItems) {
    if (item.url && !seenUrls.has(item.url)) {
      seenUrls.add(item.url);
      uniqueItems.push(item as NewsItem);
    }
  }

  // Sort by date descending
  uniqueItems.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Return top 10
  return uniqueItems.slice(0, 10);
}
