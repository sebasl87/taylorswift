"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useLocale } from "next-intl";
import LoaderSnake from "@/components/LoaderSnake";
import ArticleCard from "@/components/ArticleCard";
import { NewsArticle } from "@/types/news";

export default function NewsPreview() {
  const [news, setNews] = useState<NewsArticle[] | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale() as "es" | "en";

  useEffect(() => {
    let mounted = true;
    async function fetchNews() {
      try {
        const res = await fetch("/noticias/api/news");
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        if (!mounted) return;
        // ordenar por fecha descendente y tomar 8
        const sorted = (data as NewsArticle[]).sort(
          (a, b) =>
            new Date(b.publishedDate).getTime() -
            new Date(a.publishedDate).getTime(),
        );
        setNews(sorted.slice(0, 10));
      } catch (err) {
        console.error(err);
        setNews([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchNews();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoaderSnake size={72} caption={undefined} />;
  if (!news || news.length === 0) return null;

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {news.map((article) => (
          <Box key={article.id}>
            <ArticleCard
              title={article.title[locale as "es" | "en"]}
              description={article.description[locale as "es" | "en"]}
              imageUrl={article.imageUrl || undefined}
              imageAlt={article.imageAlt?.[locale as "es" | "en"]}
              imageCaption={article.imageCaption?.[locale as "es" | "en"]}
              linkUrl={`/noticias/${article.id}`}
              publishedDate={article.publishedDate?.split("T")[0]}
              youtubeVideoId={article.youtubeVideoId}
              articleId={article.id}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
