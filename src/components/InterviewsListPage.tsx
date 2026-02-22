"use client";
import { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Pagination,
  Button,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import interviewsData from "@/constants/interviews.json";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Interview,
  generateInterviewSlug,
  getInterviewTitle,
} from "@/types/interview";
import RandomSectionBanner from "./NewsBanner";
import { CommentsSection } from "./CommentsSection";
import { useEra } from "@/context/EraContext";

const ITEMS_PER_PAGE_DESKTOP = 10;
const ITEMS_PER_PAGE_MOBILE = 10;

function getFilterValue(
  interview: Interview,
  filter: string,
  locale: string,
): boolean {
  const lower = filter.toLowerCase();
  const title = getInterviewTitle(interview, locale);
  return (
    title.toLowerCase().includes(lower) ||
    interview.media.name.toLowerCase().includes(lower) ||
    interview.interviewer.name.toLowerCase().includes(lower) ||
    interview.interviewees.some(
      (interviewee) =>
        interviewee.name.toLowerCase().includes(lower) ||
        interviewee.role.toLowerCase().includes(lower),
    ) ||
    (interview.topics &&
      interview.topics.some((topic) => topic.toLowerCase().includes(lower))) ||
    interview.date.includes(filter)
  );
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  const formatted = date.toLocaleDateString(
    locale === "es" ? "es-ES" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: undefined,
    },
  );

  // Capitalizar solo la primera letra del mes
  const parts = formatted.split(" ");
  if (parts.length >= 2) {
    parts[0] =
      parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
    return parts.join(" ");
  }

  return formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
}

function capitalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export default function InterviewsListPage() {
  const t = useTranslations("interviews");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale();
  const [filter, setFilter] = useState("");
  const [pageDesktop, setPageDesktop] = useState(1);
  const [displayCountMobile, setDisplayCountMobile] = useState(
    ITEMS_PER_PAGE_MOBILE,
  );
  const interviews: Interview[] = interviewsData as Interview[];

  // Ordenar entrevistas por fecha (de más viejo a más nuevo)
  const sortedInterviews = [...interviews].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const filtered = filter
    ? sortedInterviews.filter((interview) =>
        getFilterValue(interview, filter, locale),
      )
    : sortedInterviews;

  // Reset pagination cuando se filtra
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setPageDesktop(1);
    setDisplayCountMobile(ITEMS_PER_PAGE_MOBILE);
  };

  // Paginación para desktop
  const totalPagesDesktop = Math.ceil(filtered.length / ITEMS_PER_PAGE_DESKTOP);
  const startIndexDesktop = (pageDesktop - 1) * ITEMS_PER_PAGE_DESKTOP;
  const endIndexDesktop = startIndexDesktop + ITEMS_PER_PAGE_DESKTOP;
  const displayedDesktop = filtered.slice(startIndexDesktop, endIndexDesktop);
  const { currentEra } = useEra();

  // "Cargar más" para mobile
  const displayedMobile = filtered.slice(0, displayCountMobile);
  const hasMoreMobile = displayCountMobile < filtered.length;

  const loadMoreMobile = () => {
    setDisplayCountMobile((prev) =>
      Math.min(prev + ITEMS_PER_PAGE_MOBILE, filtered.length),
    );
  };

  return (
    <ContainerGradientNoPadding>
      <Box
        sx={{
          background: currentEra.colors.heroOverlay,
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Box sx={{ pt: "100px", px: { xs: 2, sm: 3 } }}>
          <Breadcrumb items={[{ label: tb("interviews") }]} />
        </Box>
        <Box sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={"100%"}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 32, md: 56 },
                mb: 3,
                fontWeight: 700,
                mt: 3,
              }}
              color={currentEra.colors.heroText}
            >
              {t("title")}
            </Typography>
          </Box>

          <TextField
            label={t("search")}
            variant="outlined"
            fullWidth
            sx={{ mb: 4 }}
            value={filter}
            onChange={handleFilterChange}
          />

          {/* Tabla solo visible en desktop */}
          <TableContainer
            component={Paper}
            sx={{ mb: 4, display: { xs: "none", md: "block" } }}
          >
            <Table size="small">
              <TableHead
                sx={{
                  backgroundColor: "primary.main",
                  height: 50,
                }}
              >
                <TableRow>
                  <TableCell>
                    <Typography fontWeight={600} fontSize={18} color="white">
                      {t("date")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} fontSize={18} color="white">
                      {t("title")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} fontSize={18} color="white">
                      {t("media")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} fontSize={18} color="white">
                      {t("interviewees")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} fontSize={18} color="white">
                      {t("type")}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedDesktop.map((interview) => {
                  const title = getInterviewTitle(interview, locale);
                  const slug = generateInterviewSlug(interview.id);

                  return (
                    <TableRow
                      key={interview.id}
                      hover
                      sx={{ cursor: "pointer", height: 55 }}
                      onClick={() =>
                        (window.location.href = `/entrevistas/${slug}`)
                      }
                    >
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(interview.date, locale)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "primary.main",
                            maxWidth: 300,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {capitalizeTitle(title)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {interview.media.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {interview.interviewees.map((interviewee, index) => (
                            <Chip
                              key={index}
                              label={interviewee.name}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            interview.type === "video" ? t("video") : t("text")
                          }
                          size="small"
                          color={
                            interview.type === "video" ? "primary" : "secondary"
                          }
                          variant="filled"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación para desktop */}
          {totalPagesDesktop > 1 && (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Pagination
                count={totalPagesDesktop}
                page={pageDesktop}
                onChange={(_, page) => setPageDesktop(page)}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {/* Cards para móvil */}
          <Grid
            container
            spacing={2}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            {displayedMobile.map((interview) => {
              const title = getInterviewTitle(interview, locale);
              const slug = generateInterviewSlug(interview.id);

              return (
                <Grid size={{ xs: 12 }} key={interview.id}>
                  <Card sx={{ height: "100%" }}>
                    <CardActionArea
                      component={Link}
                      href={`/entrevistas/${slug}`}
                      sx={{ height: "100%" }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ mb: 1 }}>
                          <Chip
                            label={
                              interview.type === "video"
                                ? t("video")
                                : t("text")
                            }
                            size="small"
                            color={
                              interview.type === "video"
                                ? "primary"
                                : "secondary"
                            }
                            variant="filled"
                            sx={{ mb: 1 }}
                          />
                        </Box>

                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            fontSize: "1.1rem",
                            lineHeight: 1.3,
                            color: "primary.main",
                          }}
                        >
                          {capitalizeTitle(title)}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {interview.media.name} •{" "}
                          {formatDate(interview.date, locale)}
                        </Typography>

                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {interview.interviewees.map((interviewee, index) => (
                            <Chip
                              key={index}
                              label={interviewee.name}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.75rem" }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Botón "Cargar más" para mobile */}
          {hasMoreMobile && (
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                justifyContent: "center",
                mt: 4,
                mb: 4,
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={loadMoreMobile}
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {locale === "es"
                  ? "Cargar más entrevistas"
                  : "Load more interviews"}
              </Button>
            </Box>
          )}
          <Box my={4}>
            <RandomSectionBanner currentSection="interviews" />
          </Box>
          <CommentsSection
            pageType="article"
            pageId="interviews-list"
            customSubtitle={t("preSubtitle")}
          />
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
