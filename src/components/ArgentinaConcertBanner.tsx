"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ArgentinaConcertBanner() {
  const t = useTranslations("argentinaConcert");
  const tCountdown = useTranslations("countdown");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-04-30T21:00:00").getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const TimeUnit = ({
    value,
    label,
    labelShort,
  }: {
    value: number;
    label: string;
    labelShort: string;
  }) => (
    <Box
      sx={{
        textAlign: "center",
        p: { xs: 1.5, sm: 2 },
        border: "2px solid",
        borderColor: "primary.main",
        borderRadius: 2,
        bgcolor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 6,
          borderColor: "primary.light",
          bgcolor: "rgba(0, 0, 0, 0.7)",
        },
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          color: "primary.main",
          fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
          lineHeight: 1,
          textShadow: "0 2px 10px rgba(211, 47, 47, 0.5)",
        }}
      >
        {value.toString().padStart(2, "0")}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "white",
          mt: 0.5,
          fontSize: { xs: "0.625rem", sm: "0.75rem", md: "0.875rem" },
        }}
      >
        <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
          {labelShort}
        </Box>
        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
          {label}
        </Box>
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: { xs: 2, md: 3 },
        mb: 6,
        boxShadow: 6,
      }}
    >
      {/* Imagen de fondo */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "350px", sm: "400px", md: "450px" },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
            zIndex: 1,
          },
        }}
      >
        <Image
          src="/images/banners/bannerarg3.jpg"
          alt={t("imageAlt")}
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </Box>

      {/* Contenido superpuesto */}
      <Container
        maxWidth="lg"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          width: "100%",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            color: "white",
          }}
        >
          {/* Título principal */}
          <Typography
            variant="h1"
            sx={{
              fontSize: {
                xs: "1.75rem",
                sm: "2.5rem",
                md: "3.5rem",
                lg: "4rem",
              },
              fontWeight: 800,
              mb: { xs: 1, md: 2 },
              textShadow: "0 4px 20px rgba(0,0,0,0.8)",
              lineHeight: 1.1,
              textTransform: "uppercase",
              letterSpacing: { xs: "1px", md: "2px" },
            }}
          >
            {t("title")}
          </Typography>

          {/* Subtítulo */}
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.125rem", sm: "1.5rem", md: "2rem" },
              fontWeight: 600,
              mb: { xs: 0.5, md: 1 },
              textShadow: "0 2px 15px rgba(0,0,0,0.8)",
              color: "primary.light",
            }}
          >
            {t("venue")}
          </Typography>

          {/* Fecha */}
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              fontWeight: 500,
              mb: { xs: 0.5, md: 1 },
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            {t("date")}
          </Typography>

          {/* Link de compra de tickets */}
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
              mb: { xs: 3, md: 4 },
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            {t("buyTicketsText")}{" "}
            <Typography
              component="a"
              href="https://fullticket.com/tickets/ventas"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "primary.light",
                fontWeight: 700,
                textDecoration: "underline",
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {t("fullticket")}
            </Typography>
          </Typography>

          {/* Countdown */}
          <Box
            sx={{
              maxWidth: { xs: "100%", sm: "500px", md: "600px" },
              mx: "auto",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.25rem" },
                fontWeight: 600,
                mb: 2,
                textTransform: "uppercase",
                letterSpacing: "2px",
                textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              }}
            >
              {t("countdownTitle")}
            </Typography>

            <Grid container spacing={{ xs: 1, sm: 2 }}>
              <Grid size={{ xs: 3 }}>
                <TimeUnit
                  value={timeLeft.days}
                  label={tCountdown("days")}
                  labelShort={tCountdown("daysShort")}
                />
              </Grid>
              <Grid size={{ xs: 3 }}>
                <TimeUnit
                  value={timeLeft.hours}
                  label={tCountdown("hours")}
                  labelShort={tCountdown("hoursShort")}
                />
              </Grid>
              <Grid size={{ xs: 3 }}>
                <TimeUnit
                  value={timeLeft.minutes}
                  label={tCountdown("minutes")}
                  labelShort={tCountdown("minutesShort")}
                />
              </Grid>
              <Grid size={{ xs: 3 }}>
                <TimeUnit
                  value={timeLeft.seconds}
                  label={tCountdown("seconds")}
                  labelShort={tCountdown("secondsShort")}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
