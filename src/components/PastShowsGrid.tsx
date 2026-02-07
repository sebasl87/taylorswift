"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Pagination,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  List,
  ListItem,
  Chip,
  Link as MuiLink,
} from "@mui/material";
import { Close, CalendarMonth } from "@mui/icons-material";
import { useLocale } from "next-intl";
import { useEra } from "@/context/EraContext";
import Link from "next/link";
import Image from "next/image";

interface TourShow {
  id: string;
  eventDate: string;
  eventDateISO: string;
  tour: string | null;
  venue: {
    name: string;
    url: string;
  };
  city: {
    name: string;
    state: string;
  };
  country: {
    code: string;
    name: string;
  };
  url: string;
}

interface Song {
  name: string;
  tape: boolean;
  info: string | null;
}

interface ShowDetail extends TourShow {
  songs: Song[];
  lastUpdated: string;
}

function formatDate(dateString: string, locale: string): string {
  const [day, month, year] = dateString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function songNameToUrl(songName: string): string {
  return songName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/gi, "")
    .replace(/ /g, "-");
}

function ShowDetailModal({
  open,
  onClose,
  showId,
}: {
  open: boolean;
  onClose: () => void;
  showId: string | null;
}) {
  const { currentEra } = useEra();
  const locale = useLocale();
  const [showDetail, setShowDetail] = useState<ShowDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && showId) {
      setLoading(true);
      fetch(`/api/show?id=${showId}`)
        .then((res) => res.json())
        .then((data) => {
          setShowDetail(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching show detail:", error);
          setLoading(false);
        });
    }
  }, [open, showId]);

  if (!open) return null;

  return (
    <Dialog
      key={currentEra.id}
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disableScrollLock
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            color: "text.primary",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 1,
        }}
      >
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          pt: 0,
          overflowY: "auto",
          pr: 2,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(144, 202, 249, 0.4)",
            borderRadius: "4px",
            transition: "background 0.3s ease",
            "&:hover": {
              background: "rgba(144, 202, 249, 0.7)",
            },
          },
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(144, 202, 249, 0.4) transparent",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : showDetail ? (
          <Box>
            {/* Header con imagen */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: 150,
                overflow: "hidden",
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Image
                src="/images/banners/taylive.jpg"
                alt="Show"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  p: 2,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                    mb: 0.5,
                  }}
                >
                  {showDetail.venue.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  {showDetail.city.name},{" "}
                  {showDetail.city.state && `${showDetail.city.state}, `}
                  {showDetail.country.name}
                </Typography>
              </Box>
            </Box>

            {/* Info */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                  justifyContent: "center",
                }}
              >
                <CalendarMonth fontSize="small" color="primary" />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "0.9rem", md: "1rem" },
                  }}
                >
                  {formatDate(showDetail.eventDate, locale)}
                </Typography>
              </Box>

              {showDetail.tour && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Chip
                    label={showDetail.tour}
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}
                  />
                </Box>
              )}
            </Box>

            {/* Setlist */}
            {showDetail.songs && showDetail.songs.length > 0 && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                  }}
                >
                  Setlist ({showDetail.songs.length})
                </Typography>
                <List dense sx={{ p: 0 }}>
                  {showDetail.songs.map((song, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        py: 0.5,
                        px: 0,
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          minWidth: 24,
                          color: "text.secondary",
                          fontSize: { xs: "0.8rem", md: "0.875rem" },
                        }}
                      >
                        {index + 1}.
                      </Typography>
                      <Link
                        href={`/songs/${songNameToUrl(song.name)}`}
                        passHref
                        legacyBehavior
                      >
                        <Typography
                          component="a"
                          sx={{
                            fontSize: { xs: "0.85rem", md: "0.95rem" },
                            cursor: "pointer",
                            textDecoration: "none",
                            color: "text.primary",
                            transition: "color 0.2s",
                            flex: 1,
                            "&:hover": {
                              color: "primary.main",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {song.name}
                          {song.info && (
                            <Typography
                              component="span"
                              sx={{
                                ml: 1,
                                fontSize: "0.75rem",
                                color: "primary.main",
                                fontStyle: "italic",
                              }}
                            >
                              ({song.info})
                            </Typography>
                          )}
                        </Typography>
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Créditos */}
            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: 1,
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <MuiLink
                href={showDetail.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                  color: "text.secondary",
                  textDecoration: "none",
                  "&:hover": {
                    color: "primary.main",
                    textDecoration: "underline",
                  },
                }}
              >
                Source: setlist.fm
              </MuiLink>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              {locale === "es"
                ? "No se pudo cargar el detalle del show"
                : "Could not load show details"}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function PastShowsGrid() {
  const [shows, setShows] = useState<TourShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tour?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setShows(data.cards || []);
        setTotalPages(Math.ceil(data.total / data.itemsPerPage));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tour shows:", error);
        setLoading(false);
      });
  }, [page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowClick = (showId: string) => {
    setSelectedShowId(showId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedShowId(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {shows.map((show) => (
          <Grid key={show.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => handleShowClick(show.id)}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  color="primary"
                  sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                >
                  {formatDate(show.eventDate, locale)}
                </Typography>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
                >
                  {show.city.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  {show.venue.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, fontSize: { xs: "0.85rem", md: "0.875rem" } }}
                >
                  {show.city.state && `${show.city.state}, `}
                  {show.country.name}
                </Typography>
                {show.tour && (
                  <Chip
                    label={show.tour}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Paginación */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="medium"
            siblingCount={0}
            boundaryCount={1}
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: { xs: "0.75rem", md: "0.875rem" },
                minWidth: { xs: 28, md: 32 },
                height: { xs: 28, md: 32 },
                margin: { xs: "0 2px", md: "0 4px" },
              },
            }}
          />
        </Box>
      )}

      {/* Modal de detalle */}
      <ShowDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        showId={selectedShowId}
      />
    </>
  );
}
