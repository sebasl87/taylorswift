"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardMedia,
  TextField,
  Button,
  Typography,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";

type CommentItem = {
  id: string;
  name: string;
  content: string;
  created_at: string;
};

interface CommentsSectionProps {
  pageType: string;
  pageId: string;
  pageTitle?: string;
}

export function CommentsSection({
  pageType,
  pageId,
  pageTitle = "",
}: CommentsSectionProps) {
  const t = useTranslations("comments");
  const locale = useLocale();

  const [items, setItems] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
    website: "", // honeypot
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    content: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const key = useMemo(() => `${pageType}:${pageId}`, [pageType, pageId]);

  // Load comments
  async function load() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/comments?pageType=${encodeURIComponent(
          pageType
        )}&pageId=${encodeURIComponent(pageId)}&limit=50`,
        { cache: "no-store" }
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

  // Validation
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      email: "",
      content: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = t("validation.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("validation.emailInvalid");
    }

    if (!formData.content.trim()) {
      newErrors.content = t("validation.contentRequired");
    } else if (formData.content.trim().length < 10) {
      newErrors.content = t("validation.contentMinLength");
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.content;
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      validateEmail(formData.email) &&
      formData.content.trim().length >= 10
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formData.website) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setPosting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageType,
          pageId,
          name: formData.name,
          email: formData.email,
          content: formData.content,
          website: formData.website,
        }),
      });

      await response.json().catch(() => ({}));

      if (response.ok) {
        setFormData({ name: "", email: "", content: "", website: "" });
        setSubmitStatus("success");
        setTimeout(() => setSubmitStatus(null), 5000);
        await load();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setPosting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 6,
        mb: 4,
        boxShadow: 3,
      }}
    >
      {/* Header con imagen */}
      <Box sx={{ position: "relative", height: { xs: 200, md: 250 } }}>
        <CardMedia
          component="img"
          image="/images/banners/comentarios.jpg"
          alt="Comentarios"
          sx={{
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.4)",
          }}
        />
        <Typography
          variant="h4"
          component="h2"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontWeight: 700,
            textAlign: "center",
            textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
            fontSize: { xs: "1.5rem", md: "2.125rem" },
            width: "90%",
          }}
        >
          {pageTitle ? t("title", { title: pageTitle }) : t("formTitle")}
        </Typography>
      </Box>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Formulario */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label={t("name")}
            placeholder={t("namePlaceholder")}
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
            sx={{ mb: 2 }}
            disabled={posting}
          />

          <TextField
            fullWidth
            label={t("email")}
            placeholder={t("emailPlaceholder")}
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
            sx={{ mb: 2 }}
            disabled={posting}
          />

          <TextField
            fullWidth
            label={t("content")}
            placeholder={t("contentPlaceholder")}
            multiline
            rows={4}
            value={formData.content}
            onChange={(e) => handleChange("content", e.target.value)}
            error={!!errors.content}
            helperText={errors.content}
            required
            sx={{ mb: 2 }}
            disabled={posting}
          />

          {/* Honeypot field - hidden from users */}
          <Box sx={{ position: "absolute", left: -9999, top: -9999 }}>
            <TextField
              name="website"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </Box>

          {submitStatus && (
            <Alert
              severity={submitStatus}
              sx={{ mb: 2 }}
              onClose={() => setSubmitStatus(null)}
            >
              {submitStatus === "success" ? t("success") : t("error")}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!isFormValid() || posting}
            endIcon={posting ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              py: 1.5,
              px: 4,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            {posting ? t("submitting") : t("submit")}
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Lista de comentarios */}
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {t("formTitle")} ({items.length})
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            {t("noComments")}
          </Typography>
        ) : (
          <Box
            sx={{
              maxHeight: 600,
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.3)",
                },
              },
            }}
          >
            {items.map((comment) => (
              <Card
                key={comment.id}
                variant="outlined"
                sx={{
                  mb: 2,
                  p: 2,
                  backgroundColor: "background.paper",
                  "&:hover": {
                    boxShadow: 1,
                  },
                }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {comment.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.created_at)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{ whiteSpace: "pre-wrap" }}
                    >
                      {comment.content}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Card>
  );
}
