"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useColorMode } from "@/theme/useColorMode";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

// Lazy load del SearchModal para mejor performance inicial
const SearchModal = dynamic(() => import("./SearchModal"), {
  ssr: false,
});

export default function Header() {
  const { mode, toggle } = useColorMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mediaAnchorEl, setMediaAnchorEl] = useState<null | HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const currentLocale = useLocale();
  const t = useTranslations("navigation");
  const pathname = usePathname();

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Activar después de 50px de scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mediaItems = [
    { label: t("discography"), href: "/discography" },
    { label: t("videos"), href: "/videos" },
    { label: t("dvds"), href: "/dvds" },
    { label: t("shows"), href: "/shows" },
    { label: t("bootlegs"), href: "/bootlegs" },
  ];

  const navigationItems = [
    { label: t("home"), href: "/" },
    { label: t("tour"), href: "/tour" },
    { label: t("media"), href: "#", hasSubmenu: true },
    { label: t("news"), href: "/noticias" },
    { label: t("interviews"), href: "/entrevistas" },
    { label: t("history"), href: "/historia" },
    { label: t("lineups"), href: "/formaciones" },
    { label: t("members"), href: "/miembros" },
    { label: t("songs"), href: "/songs" },
  ];

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; max-age=31536000; path=/`;
    window.location.reload();
    handleLanguageClose();
  };

  const handleMediaMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setMediaAnchorEl(event.currentTarget);
  };

  const handleMediaMouseLeave = () => {
    setMediaAnchorEl(null);
  };

  const isMediaActive = mediaItems.some((item) =>
    pathname.startsWith(item.href)
  );

  // Función para obtener el color de fondo basado en scroll y modo
  const getBackgroundColor = () => {
    if (!isScrolled) return "transparent";
    return mode === "dark"
      ? "rgba(0, 0, 0, 0.95)"
      : "rgba(255, 255, 255, 0.95)";
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={isScrolled ? 4 : 0}
        sx={{
          backgroundColor: getBackgroundColor(),
          backdropFilter: isScrolled ? "blur(10px)" : "none",
          borderBottom: isScrolled
            ? mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(0, 0, 0, 0.1)"
            : "none",
          transition: "all 0.3s ease-in-out",
          padding: 1,
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
          <Toolbar sx={{ gap: 2, px: { xs: 0, sm: 0 } }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              <Link
                href="/"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: { xs: "150px", sm: "200px" },
                    height: { xs: "35px", sm: "47px" },
                  }}
                >
                  <Image
                    src="/logo-megadeth.png"
                    alt="Megadeth"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </Box>
              </Link>
            </Typography>

            {/* Navegación centrada - solo desktop */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", xl: "flex" },
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                {navigationItems.map((item) => {
                  const isActive = item.hasSubmenu
                    ? isMediaActive
                    : item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                  if (item.hasSubmenu) {
                    return (
                      <Box
                        key="media"
                        onMouseEnter={handleMediaMouseEnter}
                        onMouseLeave={handleMediaMouseLeave}
                      >
                        <Button
                          sx={{
                            position: "relative",
                            color: "text.primary",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            letterSpacing: "0.5px",
                            px: 1,
                            py: 1,
                            transition: "all 0.3s ease",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              bottom: 0,
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: isActive ? "80%" : "0%",
                              height: "2px",
                              backgroundColor: "primary.main",
                              transition: "width 0.3s ease",
                            },
                            "&:hover": {
                              backgroundColor: "transparent",
                              color: "primary.main",
                              "&::after": {
                                width: "80%",
                              },
                            },
                          }}
                        >
                          {item.label}
                        </Button>
                        <Menu
                          anchorEl={mediaAnchorEl}
                          open={Boolean(mediaAnchorEl)}
                          onClose={handleMediaMouseLeave}
                          MenuListProps={{
                            onMouseLeave: handleMediaMouseLeave,
                          }}
                          sx={{
                            "& .MuiPaper-root": {
                              mt: 1,
                            },
                          }}
                        >
                          {mediaItems.map((mediaItem) => (
                            <MenuItem
                              key={mediaItem.href}
                              component={Link}
                              href={mediaItem.href}
                              onClick={handleMediaMouseLeave}
                              sx={{
                                backgroundColor: pathname.startsWith(
                                  mediaItem.href
                                )
                                  ? "primary.main"
                                  : "transparent",
                                color: pathname.startsWith(mediaItem.href)
                                  ? "white"
                                  : "text.primary",
                                "&:hover": {
                                  backgroundColor: pathname.startsWith(
                                    mediaItem.href
                                  )
                                    ? "primary.dark"
                                    : "action.hover",
                                },
                              }}
                            >
                              {mediaItem.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </Box>
                    );
                  }

                  return (
                    <Button
                      key={item.href}
                      component={Link}
                      href={item.href}
                      sx={{
                        position: "relative",
                        color: "text.primary",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        letterSpacing: "0.5px",
                        px: 1,
                        py: 1,
                        transition: "all 0.3s ease",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: isActive ? "80%" : "0%",
                          height: "2px",
                          backgroundColor: "primary.main",
                          transition: "width 0.3s ease",
                        },
                        "&:hover": {
                          backgroundColor: "transparent",
                          color: "primary.main",
                          "&::after": {
                            width: "80%",
                          },
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            </Box>

            {/* Espaciador para mobile/tablet */}
            <Box sx={{ flexGrow: 1, display: { xs: "block", xl: "none" } }} />

            <IconButton
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              sx={{
                color: "text.primary",
                display: { xs: "none", sm: "flex" },
              }}
            >
              <SearchIcon />
            </IconButton>

            <Button
              startIcon={<LanguageIcon />}
              onClick={handleLanguageClick}
              sx={{
                textTransform: "uppercase",
                minWidth: "auto",
                display: { xs: "none", sm: "flex" },
              }}
            >
              {currentLocale}
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleLanguageClose}
            >
              <MenuItem onClick={() => handleLanguageChange("en")}>
                English
              </MenuItem>
              <MenuItem onClick={() => handleLanguageChange("es")}>
                Español
              </MenuItem>
            </Menu>

            <IconButton
              onClick={toggle}
              aria-label="Cambiar tema"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            {/* Botón hamburguesa para mobile/tablet */}
            <IconButton
              sx={{
                display: { xs: "block", xl: "none" },
                color: mode === "dark" ? "white" : "black",
              }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>

        {/* Drawer para navegación mobile */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 280,
              backgroundColor: mode === "dark" ? "grey.900" : "grey.50",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box width="100%" display="flex" justifyContent="center" mb={2}>
              <Image
                src="/logo-megadeth.png"
                alt="Megadeth"
                width={150}
                height={30}
              />
            </Box>

            {/* Botones de acción para mobile */}
            <Box
              sx={{ display: "flex", gap: 1, mb: 2, justifyContent: "center" }}
            >
              <IconButton
                onClick={() => {
                  setSearchOpen(true);
                  setDrawerOpen(false);
                }}
                aria-label="Buscar"
                sx={{ color: "text.primary" }}
              >
                <SearchIcon />
              </IconButton>
              <IconButton
                onClick={handleLanguageClick}
                aria-label="Cambiar idioma"
                sx={{ color: "text.primary" }}
              >
                <LanguageIcon />
              </IconButton>
              <IconButton onClick={toggle} aria-label="Cambiar tema">
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Box>

            <List>
              {navigationItems.map((item) => {
                if (item.hasSubmenu) {
                  return (
                    <Box key="media">
                      <ListItem disablePadding>
                        <ListItemButton
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            backgroundColor: isMediaActive
                              ? "primary.main"
                              : "transparent",
                            color: isMediaActive ? "white" : "text.primary",
                            "&:hover": {
                              backgroundColor: isMediaActive
                                ? "primary.dark"
                                : "action.hover",
                            },
                          }}
                        >
                          <ListItemText
                            primary={item.label}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontWeight: isMediaActive ? 600 : 400,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                      {mediaItems.map((mediaItem) => {
                        const isActive = pathname.startsWith(mediaItem.href);
                        return (
                          <ListItem key={mediaItem.href} disablePadding>
                            <ListItemButton
                              component={Link}
                              href={mediaItem.href}
                              onClick={() => setDrawerOpen(false)}
                              sx={{
                                borderRadius: 1,
                                mb: 1,
                                ml: 2,
                                backgroundColor: isActive
                                  ? "primary.main"
                                  : "transparent",
                                color: isActive ? "white" : "text.primary",
                                "&:hover": {
                                  backgroundColor: isActive
                                    ? "primary.dark"
                                    : "action.hover",
                                },
                              }}
                            >
                              <ListItemText
                                primary={mediaItem.label}
                                sx={{
                                  "& .MuiListItemText-primary": {
                                    fontWeight: isActive ? 600 : 400,
                                    fontSize: "0.9rem",
                                  },
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </Box>
                  );
                }

                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <ListItem key={item.href} disablePadding>
                    <ListItemButton
                      component={Link}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        backgroundColor: isActive
                          ? "primary.main"
                          : "transparent",
                        color: isActive ? "white" : "text.primary",
                        "&:hover": {
                          backgroundColor: isActive
                            ? "primary.dark"
                            : "action.hover",
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontWeight: isActive ? 600 : 400,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      </AppBar>

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
