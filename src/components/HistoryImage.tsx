"use client";

import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { HistoryImage, getText } from "@/types/historia";
import { useLocale } from "next-intl";

interface HistoryImageComponentProps {
  image: HistoryImage;
  priority?: boolean;
}

export default function HistoryImageComponent({
  image,
  priority = false,
}: HistoryImageComponentProps) {
  const locale = useLocale() as "es" | "en";

  // Resolve bilingual alt text
  const altText = getText(image.alt, locale);

  // Append version query param to bust browser/Next.js cache
  // We use a static version number that we increment when we update assets
  const imageSrc = `${image.src}?v=3`;

  const getImageSizeStyles = () => {
    switch (image.size) {
      case "small":
        return { width: 250, height: 180 };
      case "medium":
        return { width: 400, height: 300 };
      case "large":
        return { width: 600, height: 400 };
      case "full":
        return { width: 800, height: 500 };
      default:
        return { width: 1440, height: 500 };
    }
  };

  const getContainerStyles = () => {
    const baseSize = getImageSizeStyles();

    const aspectStyles = image.aspectRatio
      ? (() => {
          switch (image.aspectRatio) {
            case "1:1":
              return { aspectRatio: "1 / 1" };
            case "4:3":
              return { aspectRatio: "4 / 3" };
            case "16:9":
              return { aspectRatio: "16 / 9" };
            case "21:9":
              return { aspectRatio: "21 / 9" };
            default:
              return {};
          }
        })()
      : {};

    switch (image.position) {
      case "left":
        return {
          width: baseSize.width,
          height: baseSize.height,
          ...aspectStyles,
          float: "left" as const,
          marginRight: "20px",
          marginBottom: "20px",
          // Media query para mobile
          "@media (max-width: 600px)": {
            width: "100%",
            float: "none",
            margin: "20px 0",
          },
        };
      case "right":
        return {
          width: baseSize.width,
          height: baseSize.height,
          ...aspectStyles,
          float: "right" as const,
          marginLeft: "20px",
          marginBottom: "20px",
          // Media query para mobile
          "@media (max-width: 600px)": {
            width: "100%",
            float: "none",
            margin: "20px 0",
          },
        };
      case "center":
        return {
          width: baseSize.width,
          height: baseSize.height,
          ...aspectStyles,
          margin: "20px auto",
          display: "block",
          // Media query para mobile
          "@media (max-width: 600px)": {
            width: "100%",
            margin: "20px 0",
          },
        };
      case "full":
        return {
          width: "100%",
          height: 500,
          ...aspectStyles,
          margin: "30px 0",
        };
      case "background":
        return {
          width: "100%",
          height: "60vh",
          position: "relative" as const,
          ...aspectStyles,
        };
      default:
        return {
          width: baseSize.width,
          height: baseSize.height,
          ...aspectStyles,
          margin: "auto",
          display: "block",
          // Media query para mobile
          "@media (max-width: 600px)": {
            width: "100%",
            margin: "20px 0",
          },
        };
    }
  };

  const getImageProps = () => {
    if (image.position === "background") {
      return {
        fill: true,
        style: { objectFit: "cover" as const },
      };
    } else {
      const size = getImageSizeStyles();
      return {
        width: size.width,
        height: size.height,
        style: {
          objectFit: "cover" as const,
          width: "100%",
          height: "100%",
        },
      };
    }
  };

  const getLayoutComponent = () => {
    const containerStyles = getContainerStyles();
    const imageProps = getImageProps();

    switch (image.layout) {
      case "float":
        return (
          <Box
            sx={{
              ...containerStyles,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              position: "relative",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
              },
            }}
          >
            <Image
              src={imageSrc}
              alt={altText}
              {...imageProps}
              priority={priority}
            />
            {image.caption && (
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  color: "white",
                  padding: "8px 12px",
                  fontSize: "0.75rem",
                }}
              >
                {image.caption && getText(image.caption, locale)}
              </Typography>
            )}
          </Box>
        );

      case "gallery":
        return (
          <Box
            sx={{
              ...containerStyles,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
              transition: "all 0.4s ease",
              position: "relative",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
              },
            }}
          >
            <Image
              src={imageSrc}
              alt={altText}
              {...imageProps}
              priority={priority}
            />
            {image.caption && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  color: "white",
                  padding: "20px 15px 12px",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {image.caption && getText(image.caption, locale)}
                </Typography>
              </Box>
            )}
          </Box>
        );

      case "parallax":
        return (
          <Box
            sx={{
              ...containerStyles,
              overflow: "hidden",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1))",
                zIndex: 1,
              },
            }}
          >
            <Image
              src={imageSrc}
              alt={altText}
              {...imageProps}
              priority={priority}
            />
            {image.caption && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 30,
                  left: 30,
                  right: 30,
                  zIndex: 2,
                  color: "white",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {image.caption && getText(image.caption, locale)}
                </Typography>
              </Box>
            )}
          </Box>
        );

      case "carousel":
        return (
          <Box
            sx={{
              ...containerStyles,
              borderRadius: 2,
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              "&::after": {
                content: '""',
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "60px",
                height: "60px",
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: "50%",
                opacity: 0,
                transition: "opacity 0.3s ease",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='%23333'%3E%3Cpath d='M8 5v14l11-7z'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "24px",
              },
              "&:hover::after": {
                opacity: 1,
              },
            }}
          >
            <Image
              src={imageSrc}
              alt={altText}
              {...imageProps}
              priority={priority}
            />
            {image.caption && (
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  backgroundColor: "rgba(0,0,0,0.8)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: 1,
                  fontSize: "0.7rem",
                }}
              >
                {image.caption && getText(image.caption, locale)}
              </Typography>
            )}
          </Box>
        );

      case "collage":
        return (
          <Box
            sx={{
              ...containerStyles,
              borderRadius: 4,
              overflow: "hidden",
              transform: "rotate(-2deg)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
              transition: "all 0.4s ease",
              position: "relative",
              "&:hover": {
                transform: "rotate(0deg) scale(1.05)",
                boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
              },
            }}
          >
            <Image
              src={imageSrc}
              alt={altText}
              {...imageProps}
              priority={priority}
            />
            {image.caption && (
              <Typography
                variant="body2"
                sx={{
                  position: "absolute",
                  bottom: -30,
                  left: 10,
                  transform: "rotate(5deg)",
                  backgroundColor: "white",
                  color: "black",
                  padding: "6px 12px",
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  fontSize: "0.8rem",
                  fontFamily: "monospace",
                }}
              >
                {image.caption && getText(image.caption, locale)}
              </Typography>
            )}
          </Box>
        );

      default:
        return (
          <Box
            sx={{
              ...containerStyles,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Image
              src={imageSrc}
              alt={altText}
              {...imageProps}
              priority={priority}
            />
            {image.caption && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 1,
                  fontStyle: "italic",
                  color: "text.secondary",
                }}
              >
                {image.caption && getText(image.caption, locale)}
              </Typography>
            )}
          </Box>
        );
    }
  };

  return getLayoutComponent();
}
