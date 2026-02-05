"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { getAllSongs } from "@/utils/songs";
import discographyData from "@/constants/discography.json";
import liveAlbumsData from "@/constants/liveAlbums.json";
import compilationsData from "@/constants/compilations.json";
import epsData from "@/constants/eps.json";
import showsData from "@/constants/shows.json";
import newsData from "@/constants/news.json";
import membersData from "@/constants/members.json";
import interviewsData from "@/constants/interviews.json";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

function songNameToUrl(songName: string): string {
  return songName
    .toLowerCase()
    .replace(/[^a-z0-9 ]/gi, "")
    .replace(/ /g, "-");
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const t = useTranslations("search");
  const locale = useLocale() as "es" | "en";

  const searchResults = useMemo(() => {
    if (query.trim().length < 2) {
      return {
        songs: [],
        albums: [],
        shows: [],
        news: [],
        members: [],
        interviews: [],
      };
    }

    const searchTerm = query.toLowerCase();

    // Buscar canciones
    const songsList = getAllSongs();
    const songs = songsList
      .filter(
        (song) =>
          song.title.toLowerCase().includes(searchTerm) ||
          song.album.title.toLowerCase().includes(searchTerm) ||
          song.credits?.writers?.lyrics?.some((w: string) =>
            w.toLowerCase().includes(searchTerm),
          ) ||
          song.credits?.writers?.music?.some((w: string) =>
            w.toLowerCase().includes(searchTerm),
          ),
      )
      .slice(0, 5);

    // Buscar álbumes
    const allAlbums = [
      ...(discographyData as unknown as {
        id: string;
        title: string;
        year: number;
        cover: string;
      }[]),
      ...(liveAlbumsData as unknown as {
        id: string;
        title: string;
        year: number;
        cover: string;
      }[]),
      ...(compilationsData as unknown as {
        id: string;
        title: string;
        year: number;
        cover: string;
      }[]),
      ...(epsData as unknown as {
        id: string;
        title: string;
        year: number;
        cover: string;
      }[]),
    ];
    const albums = allAlbums
      .filter(
        (album) =>
          album.title.toLowerCase().includes(searchTerm) ||
          album.year.toString().includes(searchTerm),
      )
      .slice(0, 5);

    // Buscar shows
    const shows = (
      showsData as unknown as {
        id: string;
        city: string;
        venue: string;
        country: string;
        era: string;
        date: string;
      }[]
    )
      .filter(
        (show) =>
          show.city.toLowerCase().includes(searchTerm) ||
          show.venue.toLowerCase().includes(searchTerm) ||
          show.country.toLowerCase().includes(searchTerm) ||
          show.era.toLowerCase().includes(searchTerm),
      )
      .slice(0, 5);

    // Buscar noticias
    const news = (
      newsData as unknown as {
        id: string;
        title: Record<"es" | "en", string>;
        description: Record<"es" | "en", string>;
      }[]
    )
      .filter(
        (article) =>
          article.title[locale].toLowerCase().includes(searchTerm) ||
          article.description[locale].toLowerCase().includes(searchTerm),
      )
      .slice(0, 5);

    // Buscar miembros
    const membersMap = Array.isArray(membersData as unknown)
      ? {}
      : (
          membersData as unknown as {
            members?: Record<string, { id: string; name: string }>;
          }
        ).members || {};
    const members = Object.values(membersMap)
      .filter((member) => member.name.toLowerCase().includes(searchTerm))
      .slice(0, 5);

    // Buscar entrevistas
    const interviews = (
      interviewsData as unknown as {
        id: string;
        interviewees?: { name?: string }[];
        media?: { name?: string };
        date?: string;
      }[]
    )
      .filter(
        (interview) =>
          interview.interviewees?.some((person) =>
            person.name?.toLowerCase().includes(searchTerm),
          ) || interview.media?.name?.toLowerCase().includes(searchTerm),
      )
      .slice(0, 5);

    return { songs, albums, shows, news, members, interviews };
  }, [query, locale]);

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  const totalResults =
    searchResults.songs.length +
    searchResults.albums.length +
    searchResults.shows.length +
    searchResults.news.length +
    searchResults.members.length +
    searchResults.interviews.length;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: 1, sm: 2 },
            maxHeight: { xs: "100vh", sm: "80vh" },
            m: { xs: 0, sm: 2 },
            width: { xs: "90%", sm: "100%" },
          },
        }}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Input de búsqueda */}
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <TextField
              fullWidth
              autoFocus
              placeholder={t("placeholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <InputAdornment position="end">
                    <CloseIcon
                      sx={{ cursor: "pointer" }}
                      onClick={() => setQuery("")}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: { xs: "1rem", md: "1.125rem" },
                },
              }}
            />
          </Box>

          {/* Resultados */}
          <Box
            sx={{
              maxHeight: { xs: "calc(100vh - 80px)", sm: "60vh" },
              overflow: "auto",
              p: { xs: 1.5, sm: 2 },
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(128, 128, 128, 0.3)",
                borderRadius: "4px",
                "&:hover": {
                  backgroundColor: "rgba(128, 128, 128, 0.5)",
                },
              },
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(128, 128, 128, 0.3) transparent",
            }}
          >
            {query.trim().length < 2 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                {t("typeToSearch")}
              </Typography>
            ) : totalResults === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {t("noResults")} &quot;{query}&quot;
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("tryWith")}
                </Typography>
              </Box>
            ) : (
              <>
                {/* Canciones */}
                {searchResults.songs.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontSize: "1rem", fontWeight: 600 }}
                    >
                      🎵 {t("songs")} ({searchResults.songs.length})
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {searchResults.songs.map((song) => (
                        <ListItem key={song.id} disablePadding>
                          <Link
                            href={`/songs/${songNameToUrl(song.title)}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              width: "100%",
                            }}
                            onClick={handleClose}
                          >
                            <ListItemButton sx={{ borderRadius: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  width: "100%",
                                }}
                              >
                                <Box
                                  sx={{
                                    position: "relative",
                                    width: 40,
                                    height: 40,
                                    flexShrink: 0,
                                  }}
                                >
                                  <Image
                                    src={song.album.cover}
                                    alt={song.album.title}
                                    fill
                                    style={{
                                      objectFit: "cover",
                                      borderRadius: 4,
                                    }}
                                  />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {song.title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {song.album.title} ({song.album.year})
                                  </Typography>
                                </Box>
                              </Box>
                            </ListItemButton>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Álbumes */}
                {searchResults.albums.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontSize: "1rem", fontWeight: 600 }}
                    >
                      💿 {t("albums")} ({searchResults.albums.length})
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {searchResults.albums.map((album) => (
                        <ListItem key={album.id} disablePadding>
                          <Link
                            href={`/discography/${album.id}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              width: "100%",
                            }}
                            onClick={handleClose}
                          >
                            <ListItemButton sx={{ borderRadius: 1 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                  width: "100%",
                                }}
                              >
                                <Box
                                  sx={{
                                    position: "relative",
                                    width: 40,
                                    height: 40,
                                    flexShrink: 0,
                                  }}
                                >
                                  <Image
                                    src={album.cover}
                                    alt={album.title}
                                    fill
                                    style={{
                                      objectFit: "cover",
                                      borderRadius: 4,
                                    }}
                                  />
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {album.title}
                                  </Typography>
                                  <Chip
                                    label={album.year}
                                    size="small"
                                    sx={{ height: 18, fontSize: "0.7rem" }}
                                  />
                                </Box>
                              </Box>
                            </ListItemButton>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Shows */}
                {searchResults.shows.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontSize: "1rem", fontWeight: 600 }}
                    >
                      📍 {t("shows")} ({searchResults.shows.length})
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {searchResults.shows.map((show) => (
                        <ListItem key={show.id} disablePadding>
                          <Link
                            href={`/shows/${show.id}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              width: "100%",
                            }}
                            onClick={handleClose}
                          >
                            <ListItemButton sx={{ borderRadius: 1 }}>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {show.venue}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {show.city}, {show.country} ({show.date})
                                </Typography>
                              </Box>
                            </ListItemButton>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Noticias */}
                {searchResults.news.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontSize: "1rem", fontWeight: 600 }}
                    >
                      📰 {t("news")} ({searchResults.news.length})
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {searchResults.news.map((article) => (
                        <ListItem key={article.id} disablePadding>
                          <Link
                            href={`/noticias/${article.id}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              width: "100%",
                            }}
                            onClick={handleClose}
                          >
                            <ListItemButton sx={{ borderRadius: 1 }}>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {article.title[locale]}
                                </Typography>
                              </Box>
                            </ListItemButton>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Miembros */}
                {searchResults.members.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontSize: "1rem", fontWeight: 600 }}
                    >
                      👤 {t("members")} ({searchResults.members.length})
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {searchResults.members.map((member) => (
                        <ListItem key={member.id} disablePadding>
                          <Link
                            href={`/miembros#${member.id}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              width: "100%",
                            }}
                            onClick={handleClose}
                          >
                            <ListItemButton sx={{ borderRadius: 1 }}>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {member.name}
                                </Typography>
                              </Box>
                            </ListItemButton>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {/* Entrevistas */}
                {searchResults.interviews.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontSize: "1rem", fontWeight: 600 }}
                    >
                      🎤 {t("interviews")} ({searchResults.interviews.length})
                    </Typography>
                    <List sx={{ p: 0 }}>
                      {searchResults.interviews.map((interview) => (
                        <ListItem key={interview.id} disablePadding>
                          <Link
                            href={`/entrevistas/${interview.id}`}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              width: "100%",
                            }}
                            onClick={handleClose}
                          >
                            <ListItemButton sx={{ borderRadius: 1 }}>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {interview.interviewees
                                    ?.map((p) => p.name)
                                    .join(", ")}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {interview.media?.name} ({interview.date})
                                </Typography>
                              </Box>
                            </ListItemButton>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
