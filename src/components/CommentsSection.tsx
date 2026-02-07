"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Divider,
  Alert,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import SendIcon from "@mui/icons-material/Send";

type CommentItem = {
  id: string;
  name: string;
  content: string;
  created_at: string;
};

export function CommentsSection({
  pageType,
  pageId,
  title,
  customSubtitle,
}: {
  pageType: string;
  pageId: string;
  title?: string;
  customSubtitle?: string;
}) {
  const t = useTranslations("comments");
  const locale = useLocale();

  const [items, setItems] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  // honeypot
  const [website, setWebsite] = useState("");

  // Email validation
  const isValidEmail = useMemo(() => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  // Form validation
  const isFormValid = useMemo(() => {
    return name.trim() && isValidEmail && content.trim() && !website;
  }, [name, content, website, isValidEmail]);

  const key = useMemo(() => `${pageType}:${pageId}`, [pageType, pageId]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/comments?pageType=${encodeURIComponent(
          pageType,
        )}&pageId=${encodeURIComponent(pageId)}&limit=50`,
        { cache: "no-store" },
      );
      const json = await res.json();
      setItems(Array.isArray(json.items) ? json.items : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (posting || !isFormValid) return;

    setPosting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageType,
          pageId,
          name,
          email,
          content,
          website, // honeypot
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json?.error || t("error"));
        return;
      }

      // limpieza
      setName("");
      setEmail("");
      setContent("");
      setWebsite("");

      // recargar lista
      await load();
    } catch {
      setError(t("error"));
    } finally {
      setPosting(false);
    }
  }

  return (
    <Box sx={{ mt: 6, mb: 6 }}>
      {/* JSON-LD Structured Data */}
      {items.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DiscussionForumPosting",
              headline: title,
              text: customSubtitle || title,
              author: {
                "@type": "Organization",
                name: "Taylor Swift Fan Site",
                url: "https://taylorswift.com",
              },
              datePublished:
                items.length > 0
                  ? items[items.length - 1].created_at
                  : new Date().toISOString(),
              commentCount: items.length,
              comment: items.map((c) => ({
                "@type": "Comment",
                text: c.content,
                author: {
                  "@type": "Person",
                  name: c.name,
                  url: "https://taylorswift.com",
                },
                dateCreated: c.created_at,
              })),
            }),
          }}
        />
      )}

      {/* JSON-LD para el formulario de comentarios */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DiscussionForumPosting",
            headline: `${t("leave")} "${title}"`,
            text: t("subtitle"),
            author: {
              "@type": "Organization",
              name: "Taylor Swift Fan Site",
              url: "https://taylorswift.com",
            },
            datePublished: new Date().toISOString(),
            commentCount: items.length,
            comment:
              items.length > 0
                ? items.slice(0, 3).map((c) => ({
                    "@type": "Comment",
                    text: c.content,
                    author: {
                      "@type": "Person",
                      name: c.name,
                      url: "https://taylorswift.com",
                    },
                    dateCreated: c.created_at,
                  }))
                : [],
          }),
        }}
      />

      {/* Card principal que contiene todo */}
      <Card
        component="section"
        aria-labelledby="comments-section-title"
        itemScope
        itemType="https://schema.org/DiscussionForumPosting"
        sx={{ overflow: "hidden" }}
      >
        {/* Banner Header */}
        <Box sx={{ position: "relative", height: { xs: 180, md: 300 } }}>
          <Image
            src="/images/eras/comments.jpg"
            alt={t("title")}
            fill
            style={{ objectFit: "cover", objectPosition: "center 35%" }}
            priority
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: { xs: 2, md: 4 },
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              id="comments-section-title"
              itemProp="headline"
              sx={{
                color: "white",
                fontWeight: 500,
                fontSize: { xs: "1.25rem", md: "1.75rem" },
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              {customSubtitle || t("subtitle")}{" "}
              <span style={{ fontWeight: 600 }}>&quot;{title}&quot;</span>
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          {/* Formulario */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={submit}
            itemScope
            itemType="https://schema.org/CommentAction"
            aria-label={t("subtitle") + " " + title}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                label={t("name")}
                required
                fullWidth
                size="small"
              />
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label={t("email")}
                type="email"
                required
                fullWidth
                size="small"
                error={email.length > 0 && !isValidEmail}
                helperText={
                  email.length > 0 && !isValidEmail ? t("invalidEmail") : ""
                }
              />
            </Box>

            {/* Honeypot oculto */}
            <Box sx={{ position: "absolute", left: -9999, top: -9999 }}>
              <label>
                Website
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </Box>

            <TextField
              value={content}
              onChange={(e) => setContent(e.target.value)}
              label={t("content")}
              required
              fullWidth
              multiline
              rows={4}
              size="small"
              placeholder={t("placeholder")}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!isFormValid || posting}
              startIcon={
                posting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
              sx={{ alignSelf: "flex-end", minWidth: 140 }}
            >
              {posting ? t("posting") : t("submit")}
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Lista de Comentarios */}
          <Box>
            <Typography
              variant="h6"
              component="h3"
              itemProp="commentCount"
              sx={{
                mb: 3,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                fontWeight: 600,
              }}
            >
              {t("commentsTitle")} ({items.length})
            </Typography>

            {loading ? (
              <Box
                sx={{ display: "flex", justifyContent: "center", py: 4 }}
                role="status"
                aria-live="polite"
              >
                <CircularProgress />
              </Box>
            ) : items.length === 0 ? (
              <Typography
                sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
                role="status"
              >
                {t("none")}
              </Typography>
            ) : (
              <Box
                component="ul"
                role="list"
                aria-label={t("commentsTitle")}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxHeight: { xs: "none", md: "500px" },
                  overflowY: { xs: "visible", md: "auto" },
                  overflowX: "hidden",
                  pr: { xs: 0, md: 1 },
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  "&::-webkit-scrollbar": {
                    width: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "rgba(0,0,0,0.05)",
                    borderRadius: "5px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,0.3)",
                    borderRadius: "5px",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.5)",
                    },
                  },
                }}
              >
                {items.map((c) => (
                  <Card
                    key={c.id}
                    component="li"
                    variant="outlined"
                    itemScope
                    itemType="https://schema.org/Comment"
                    role="article"
                    aria-label={`Comentario de ${c.name}`}
                    sx={{
                      p: 2,
                      bgcolor: "background.default",
                      minHeight: "fit-content",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        mb: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        itemProp="author"
                        itemScope
                        itemType="https://schema.org/Person"
                        sx={{ fontWeight: 700 }}
                      >
                        <span itemProp="name">{c.name}</span>
                      </Typography>
                      <Typography
                        variant="caption"
                        component="time"
                        itemProp="dateCreated"
                        dateTime={c.created_at}
                        sx={{ color: "text.secondary" }}
                      >
                        {new Date(c.created_at).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      itemProp="text"
                      sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}
                    >
                      {c.content}
                    </Typography>
                  </Card>
                ))}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
