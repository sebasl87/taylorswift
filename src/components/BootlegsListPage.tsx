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
import bootlegsData from "@/constants/bootlegs.json";
import ContainerGradientNoPadding from "./atoms/ContainerGradientNoPadding";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Bootleg,
  generateBootlegSlug,
  getBootlegDescription,
  getBootlegYear,
} from "@/types/bootleg";
import RandomSectionBanner from "./NewsBanner";
import { CommentsSection } from "./CommentsSection";

const ITEMS_PER_PAGE_DESKTOP = 10;
const ITEMS_PER_PAGE_MOBILE = 10;

function getFilterValue(
  bootleg: Bootleg,
  filter: string,
  locale: string
): boolean {
  const lower = filter.toLowerCase();
  const description = getBootlegDescription(bootleg, locale);
  return (
    bootleg.title.toLowerCase().includes(lower) ||
    bootleg.city.toLowerCase().includes(lower) ||
    bootleg.venue.toLowerCase().includes(lower) ||
    bootleg.country.toLowerCase().includes(lower) ||
    bootleg.era.toLowerCase().includes(lower) ||
    description.toLowerCase().includes(lower) ||
    bootleg.date.includes(filter) ||
    bootleg.setlist.some((song) => song.toLowerCase().includes(lower))
  );
}

export default function BootlegsListPage() {
  const t = useTranslations("bootlegs");
  const tb = useTranslations("breadcrumb");
  const locale = useLocale();
  const [filter, setFilter] = useState("");
  const [pageDesktop, setPageDesktop] = useState(1);
  const [displayCountMobile, setDisplayCountMobile] = useState(
    ITEMS_PER_PAGE_MOBILE
  );
  const bootlegs: Bootleg[] = bootlegsData as Bootleg[];

  // Ordenar bootlegs por fecha (de más antiguo a más reciente)
  const sortedBootlegs = [...bootlegs].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const filtered = filter
    ? sortedBootlegs.filter((bootleg) =>
        getFilterValue(bootleg, filter, locale)
      )
    : sortedBootlegs;

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
      Math.min(prev + ITEMS_PER_PAGE_MOBILE, filtered.length)
    );
  };

  return (
    <ContainerGradientNoPadding>
      <Box pt={{ xs: 2, md: 4 }} px={{ xs: 2, md: 0 }} pb={{ xs: 0, md: 4 }}>
        <Breadcrumb items={[{ label: tb("bootlegs") }]} />
      </Box>
      <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={"100%"}
        >
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: 32, md: 56 }, mb: 3, fontWeight: 700, mt: 3 }}
          >
            {t("titlePage")}
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
                    {t("year")}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} fontSize={18} color="white">
                    {t("title")}
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
              {displayedDesktop.map((bootleg) => {
                const slug = generateBootlegSlug(bootleg);
                const year = getBootlegYear(bootleg);

                return (
                  <TableRow
                    key={bootleg.id}
                    hover
                    sx={{ cursor: "pointer", height: 55 }}
                    onClick={() => (window.location.href = `/bootlegs/${slug}`)}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {year}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "primary.main",
                          maxWidth: 250,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {bootleg.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 250,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {bootleg.venue}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{bootleg.city}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{bootleg.country}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={bootleg.era}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación para desktop */}
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
          />
        </Box>

        {/* Cards solo visibles en mobile */}
        <Grid
          container
          spacing={2}
          sx={{ display: { xs: "flex", md: "none" }, mb: 4 }}
        >
          {displayedMobile.map((bootleg) => {
            const slug = generateBootlegSlug(bootleg);
            const year = getBootlegYear(bootleg);
            const description = getBootlegDescription(bootleg, locale);

            return (
              <Grid size={{ xs: 12 }} key={bootleg.id}>
                <Card>
                  <CardActionArea href={`/bootlegs/${slug}`}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="primary"
                        fontWeight={600}
                      >
                        {bootleg.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        <strong>{year}</strong> • {bootleg.city},{" "}
                        {bootleg.country}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {bootleg.venue}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {description}
                      </Typography>
                      <Chip
                        label={bootleg.era}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ mt: 2 }}
                      />
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
              mb: 4,
            }}
          >
            <Button variant="contained" onClick={loadMoreMobile} size="large">
              {t("loadMore")}
            </Button>
          </Box>
        )}

        {/* <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 4, mb: 2 }}
        >
          {t("totalBootlegs", { count: filtered.length })}
        </Typography> */}
        <Box mb={4}>
          <RandomSectionBanner currentSection="bootlegs" />
        </Box>
        <CommentsSection
          pageType="article"
          pageId="bootlegs-page"
          customSubtitle={t("preSubtitle")}
        />
      </Container>
    </ContainerGradientNoPadding>
  );
}
