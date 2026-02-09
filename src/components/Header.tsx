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
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PaletteIcon from "@mui/icons-material/Palette";
import { useEra } from "@/context/EraContext";
import { ERAS } from "@/constants/eras";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Lazy load del SearchModal para mejor performance inicial
const SearchModal = dynamic(() => import("./SearchModal"), {
  ssr: false,
});

export default function Header() {
  const { currentEra, setEra } = useEra();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [eraAnchorEl, setEraAnchorEl] = useState<null | HTMLElement>(null);
  const [mediaAnchorEl, setMediaAnchorEl] = useState<null | HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const currentLocale = useLocale();
  const t = useTranslations("navigation");
  const router = useRouter();
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

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  const mediaItems = [
    { label: t("discography"), href: "/discography" },
    { label: t("shows"), href: "/shows" },
    { label: t("videos"), href: "/videos" },
  ];

  const navigationItems = [
    { label: t("home"), href: "/" },
    { label: t("tour"), href: "/tour" },
    { label: t("media"), href: "#", hasSubmenu: true },
    { label: t("news"), href: "/noticias" },
    { label: t("interviews"), href: "/entrevistas" },
    { label: t("songs"), href: "/songs" },
  ];

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorEl(null);
  };

  const handleEraClick = (event: React.MouseEvent<HTMLElement>) => {
    setEraAnchorEl(event.currentTarget);
  };

  const handleEraClose = () => {
    setEraAnchorEl(null);
  };

  const handleEraChange = (eraId: string) => {
    setEra(eraId);
    handleEraClose();
  };

  const handleLanguageChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
    handleLanguageClose();
  };

  const handleMediaMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    // Limpiar cualquier timeout pendiente
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setMediaAnchorEl(event.currentTarget);
  };

  const handleMediaMouseLeave = () => {
    // Agregar un pequeño delay antes de cerrar el menú
    const timeout = setTimeout(() => {
      setMediaAnchorEl(null);
    }, 150); // 150ms de delay
    setCloseTimeout(timeout);
  };

  const isMediaActive = mediaItems.some((item) =>
    pathname.startsWith(item.href),
  );

  // Función para obtener el color de fondo basado en scroll
  const getBackgroundColor = () => {
    if (!isScrolled) return "transparent";
    // Usar el color secundario de cada era con alta opacidad para que sea característico
    const colorToUse = currentEra.colors.secondary;
    // Convertir hex a rgba con opacidad 0.95
    const hex = colorToUse.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.95)`;
  };

  // Función para obtener el color del borde basado en la era
  const getBorderColor = () => {
    const isDark =
      currentEra.id === "reputation" || currentEra.id === "midnights";
    return isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)";
  };

  // Función para obtener el color del texto del logo
  const getLogoColor = () => {
    const isDark =
      currentEra.id === "reputation" || currentEra.id === "midnights";
    return isScrolled
      ? isDark
        ? "white"
        : currentEra.colors.text
      : isDark
        ? "white"
        : "black";
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={isScrolled ? 4 : 0}
        sx={{
          backgroundColor: getBackgroundColor(),
          backdropFilter: isScrolled ? "blur(10px)" : "none",
          borderBottom: isScrolled ? `1px solid ${getBorderColor()}` : "none",
          transition: "all 0.3s ease-in-out",
          padding: 1,
          zIndex: 1100,
          top: 0,
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1440, mx: "auto" }}>
          <Toolbar sx={{ gap: 2, px: { xs: 0, sm: 0 }, color: getLogoColor() }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              <Link
                href="/"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    color: getLogoColor(),
                    fontFamily: "var(--font-heading)",
                    letterSpacing: "-0.05em",
                    transition: "color 0.3s ease",
                    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                  }}
                >
                  TAYLOR SWIFT
                </Typography>
              </Link>
            </Typography>

            {/* Spacer para mobile - empuja botones a la derecha */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", xl: "none" } }} />

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
                          id="media-menu"
                          anchorEl={mediaAnchorEl}
                          open={Boolean(mediaAnchorEl)}
                          onClose={handleMediaMouseLeave}
                          disableScrollLock
                          MenuListProps={{
                            onMouseEnter: () => {
                              // Limpiar timeout al entrar en el menú
                              if (closeTimeout) {
                                clearTimeout(closeTimeout);
                                setCloseTimeout(null);
                              }
                            },
                            onMouseLeave: handleMediaMouseLeave,
                            sx: {
                              py: 0.5,
                            },
                          }}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                          slotProps={{
                            paper: {
                              sx: {
                                bgcolor: "background.paper",
                                color: "text.primary",
                                mt: 0.5, // Pequeño margen para evitar el gap
                              },
                            },
                          }}
                        >
                          {mediaItems.map((subItem) => (
                            <MenuItem
                              key={subItem.href}
                              onClick={handleMediaMouseLeave}
                              component={Link}
                              href={subItem.href}
                              selected={pathname.startsWith(subItem.href)}
                            >
                              {subItem.label}
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

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <IconButton onClick={() => setSearchOpen(true)} color="inherit">
                <SearchIcon />
              </IconButton>
              <IconButton
                onClick={handleEraClick}
                color="inherit"
                aria-label="Select Era"
              >
                <PaletteIcon />
              </IconButton>
              <Menu
                key={`era-${currentEra.id}`}
                anchorEl={eraAnchorEl}
                open={Boolean(eraAnchorEl)}
                onClose={handleEraClose}
                disableScrollLock
                slotProps={{
                  paper: {
                    sx: {
                      maxHeight: 400,
                      width: "250px",
                      bgcolor: "background.paper",
                      color: "text.primary",
                    },
                  },
                }}
              >
                {ERAS.map((era) => (
                  <MenuItem
                    key={era.id}
                    onClick={() => handleEraChange(era.id)}
                    selected={currentEra.id === era.id}
                    sx={{
                      borderLeft: `4px solid ${era.colors.primary}`,
                      "&.Mui-selected": {
                        backgroundColor: era.colors.secondary + "30",
                        fontWeight: "bold",
                      },
                      "&:hover": {
                        backgroundColor: era.colors.secondary + "20",
                      },
                    }}
                  >
                    {era.name}
                  </MenuItem>
                ))}
              </Menu>
              <IconButton onClick={handleLanguageClick} color="inherit">
                <LanguageIcon />
              </IconButton>
              <Menu
                key={`lang-${currentEra.id}`}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleLanguageClose}
                disableScrollLock
                slotProps={{
                  paper: {
                    sx: {
                      bgcolor: "background.paper",
                      color: "text.primary",
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => handleLanguageChange("es")}
                  selected={currentLocale === "es"}
                >
                  Español
                </MenuItem>
                <MenuItem
                  onClick={() => handleLanguageChange("en")}
                  selected={currentLocale === "en"}
                >
                  English
                </MenuItem>
              </Menu>

              {/* Menú móvil */}
              <IconButton
                color="inherit"
                sx={{ display: { xs: "block", xl: "none" } }}
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer para móvil */}
      <Drawer
        key={`drawer-${currentEra.id}`}
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        disableScrollLock
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              color: "text.primary",
            },
          },
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
        >
          <List>
            {navigationItems.map((item) => {
              if (item.hasSubmenu) {
                return mediaItems.map((subItem) => (
                  <ListItem key={subItem.href} disablePadding>
                    <ListItemButton component={Link} href={subItem.href}>
                      <ListItemText primary={subItem.label} />
                    </ListItemButton>
                  </ListItem>
                ));
              }
              return (
                <ListItem key={item.href} disablePadding>
                  <ListItemButton component={Link} href={item.href}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
