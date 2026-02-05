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
import { useRouter } from "next/router";
import Link from "next/link";
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
  const router = useRouter();
  // Ensure router is ready and get pathname without query params
  const pathname = router.asPath ? router.asPath.split('?')[0] : '/';

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
    { label: t("shows"), href: "/shows" },
    { label: t("bootlegs"), href: "/bootlegs" },
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

  const handleLanguageChange = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
    handleLanguageClose();
  };

  const handleMediaMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    setMediaAnchorEl(event.currentTarget);
  };

  const handleMediaMouseLeave = () => {
    setMediaAnchorEl(null);
  };

  const isMediaActive = mediaItems.some((item) =>
    pathname.startsWith(item.href),
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
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: "bold",
                    color: mode === "dark" ? "white" : "black",
                    fontFamily: "var(--font-geist-sans)",
                    letterSpacing: "-0.05em",
                  }}
                >
                  TAYLOR SWIFT
                </Typography>
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
                          id="media-menu"
                          anchorEl={mediaAnchorEl}
                          open={Boolean(mediaAnchorEl)}
                          onClose={handleMediaMouseLeave}
                          MenuListProps={{
                            onMouseEnter: handleMediaMouseEnter,
                            onMouseLeave: handleMediaMouseLeave,
                          }}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
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
              <IconButton onClick={toggle} color="inherit">
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <IconButton onClick={handleLanguageClick} color="inherit">
                <LanguageIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleLanguageClose}
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
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
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
