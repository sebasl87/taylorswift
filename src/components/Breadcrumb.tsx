"use client";

import { Breadcrumbs, Link, Typography, Container } from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import NextLink from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const t = useTranslations("breadcrumb");
  const locale = useLocale();

  // Generar datos estructurados JSON-LD para SEO
  const generateSchemaMarkup = () => {
    const baseUrl = "https://taylorswift.com";
    const localePrefix = locale === "es" ? "" : `/${locale}`;

    const itemListElement = [
      {
        "@type": "ListItem",
        position: 1,
        name: t("home"),
        item: `${baseUrl}${localePrefix}`,
      },
      ...items.map((item, index) => {
        const position = index + 2;
        const itemUrl = item.href
          ? `${baseUrl}${localePrefix}${item.href}`
          : null;

        return {
          "@type": "ListItem",
          position,
          name: item.label,
          ...(itemUrl && { item: itemUrl }),
        };
      }),
    ];

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement,
    };
  };

  return (
    <>
      {/* Schema markup para Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSchemaMarkup()),
        }}
      />

      {/* Breadcrumb visual */}

      <Container
        maxWidth={false}
        sx={{ maxWidth: 1440, mx: "auto", padding: 0 }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{
            padding: 0,
            "& .MuiBreadcrumbs-ol": {
              flexWrap: "wrap",
            },
            "& .MuiBreadcrumbs-li": {
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            },
          }}
        >
          {/* Home */}
          <Link
            component={NextLink}
            href="/"
            underline="hover"
            color="inherit"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            <HomeIcon sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }} />
            <Typography
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                display: { xs: "none", sm: "inline" },
              }}
            >
              {t("home")}
            </Typography>
          </Link>

          {/* Breadcrumb items */}
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            if (isLast) {
              return (
                <Typography
                  key={index}
                  color="text.primary"
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    fontWeight: 500,
                    maxWidth: { xs: "150px", sm: "200px", md: "none" },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </Typography>
              );
            }

            return (
              <Link
                key={index}
                component={NextLink}
                href={item.href || "#"}
                underline="hover"
                color="inherit"
                sx={{
                  "&:hover": {
                    color: "primary.main",
                  },
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  maxWidth: { xs: "120px", sm: "180px", md: "none" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Container>
    </>
  );
}
