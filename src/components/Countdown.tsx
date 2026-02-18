"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useTranslations } from "next-intl";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const t = useTranslations("countdown");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-01-23T00:00:00").getTime();

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

    // Calcular inmediatamente
    calculateTimeLeft();

    // Actualizar cada segundo
    const interval = setInterval(calculateTimeLeft, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        border: "2px solid",
        borderColor: "primary.main",
        borderRadius: 2,
        background:
          "linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(211, 47, 47, 0.05) 100%)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
          borderColor: "primary.dark",
        },
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          color: "primary.main",
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          lineHeight: 1,
          fontFamily: "var(--font-heading)",
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
          color: "text.secondary",
          mt: 0.5,
          fontSize: { xs: "8px", sm: "14px" },
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          mb: 3,
          fontWeight: 600,
          color: "text.primary",
          fontSize: { xs: "18Px", sm: "24px" },
        }}
      >
        {t("title")}
      </Typography>

      <Grid container spacing={{ xs: 1, sm: 2 }} justifyContent="center">
        <Grid size={{ xs: 3, sm: 3 }}>
          <TimeUnit value={timeLeft.days} label={t("days")} />
        </Grid>
        <Grid size={{ xs: 3, sm: 3 }}>
          <TimeUnit value={timeLeft.hours} label={t("hours")} />
        </Grid>
        <Grid size={{ xs: 3, sm: 3 }}>
          <TimeUnit value={timeLeft.minutes} label={t("minutes")} />
        </Grid>
        <Grid size={{ xs: 3, sm: 3 }}>
          <TimeUnit value={timeLeft.seconds} label={t("seconds")} />
        </Grid>
      </Grid>
    </Box>
  );
}
