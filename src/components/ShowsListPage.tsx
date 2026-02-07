"use client";
import { useState } from "react";
import {
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
import showsData from "@/constants/shows.json";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";
import { useEra } from "@/context/EraContext";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Show,
  formatShowDate,
  generateShowSlug,
  getShowHistoricDescription,
} from "@/types/show";
import RandomSectionBanner from "./NewsBanner";
import { CommentsSection } from "./CommentsSection";

const ITEMS_PER_PAGE_DESKTOP = 10;
const ITEMS_PER_PAGE_MOBILE = 10;

function getFilterValue(show: Show, filter: string, locale: string): boolean {
  const lower = filter.toLowerCase();
  const whyHistoric = getShowHistoricDescription(show, locale);
  return (
    show.city.toLowerCase().includes(lower) ||
    show.venue.toLowerCase().includes(lower) ||
    show.country.toLowerCase().includes(lower) ||
    show.era.toLowerCase().includes(lower) ||
    whyHistoric.toLowerCase().includes(lower) ||
    show.date.includes(filter) ||
    show.setlist.some((song) => song.toLowerCase().includes(lower))
  );
}

export default function ShowsListPage() {
  const t = useTranslations("shows");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale();
  const { currentEra } = useEra();
  const [filter, setFilter] = useState("");
  const [pageDesktop, setPageDesktop] = useState(1);
  const [displayCountMobile, setDisplayCountMobile] = useState(
    ITEMS_PER_PAGE_MOBILE,
  );
  const shows: Show[] = showsData as Show[];

  // Ordenar shows por fecha (de más reciente a más antiguo)
  const sortedShows = [...shows].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filtered = filter
    ? sortedShows.filter((show) => getFilterValue(show, filter, locale))
    : sortedShows;

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
          position: "relative",
          minHeight: "100vh",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: currentEra.colors.heroOverlay || "rgba(0,0,0,0.2)",
            pointerEvents: "none",
            transition: "background 0.5s ease",
            zIndex: 0,
          },
        }}
      >
        <Box
          pt="100px"
          pb={{ xs: 4, md: 6 }}
          maxWidth="1440px"
          mx="auto"
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Breadcrumb items={[{ label: tb("shows") }]} />
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={"100%"}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: "var(--font-heading)",
                fontSize: { xs: 32, md: 56 },
                mb: 3,
                fontWeight: 700,
                mt: 3,
                color: currentEra.colors.heroText || "#FFFFFF",
                textShadow: `2px 2px 8px ${currentEra.shadowColor}, 0 0 20px ${currentEra.shadowColor}`,
                transition: "color 0.5s ease, text-shadow 0.5s ease",
              }}
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
                      {t("venue")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} fontSize={18} color="white">
                      {t("city")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} fontSize={18} color="white">
                      {t("country")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} fontSize={18} color="white">
                      {t("era")}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedDesktop.map((show) => {
                  const slug = generateShowSlug(show);

                  return (
                    <TableRow
                      key={show.id}
                      hover
                      sx={{ cursor: "pointer", height: 55 }}
                      onClick={() => (window.location.href = `/shows/${slug}`)}
                    >
                      <TableCell>
                        <Typography variant="body2">
                          {formatShowDate(show.date, locale)}
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
                          {show.venue}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{show.city}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{show.country}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={show.era}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.75rem" }}
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
            {displayedMobile.map((show) => {
              const slug = generateShowSlug(show);

              return (
                <Grid size={{ xs: 12 }} key={show.id}>
                  <Card sx={{ height: "100%" }}>
                    <CardActionArea
                      component={Link}
                      href={`/shows/${slug}`}
                      sx={{ height: "100%" }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ mb: 1 }}>
                          <Chip
                            label={show.era}
                            size="small"
                            variant="outlined"
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
                          {show.venue}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {show.city}, {show.country} •{" "}
                          {formatShowDate(show.date, locale)}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {getShowHistoricDescription(show, locale)}
                        </Typography>
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
                {locale === "es" ? "Cargar más shows" : "Load more shows"}
              </Button>
            </Box>
          )}

          <Box my={4}>
            <RandomSectionBanner currentSection="shows" />
          </Box>
          <CommentsSection
            pageType="article"
            pageId="shows-page"
            customSubtitle={t("preSubtitle")}
          />
        </Box>
      </Box>
    </ContainerGradientNoPadding>
  );
}
