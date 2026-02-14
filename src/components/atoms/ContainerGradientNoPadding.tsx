"use client";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEra } from "@/context/EraContext";

export const ContainerGradientNoPadding = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { currentEra } = useEra();
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: currentEra.gradient,
        transition: "background 0.5s ease, color 0.5s ease",
        color: theme.palette.text.primary,
        minHeight: "100vh",
      }}
    >
      {children}
    </Box>
  );
};

export default ContainerGradientNoPadding;
