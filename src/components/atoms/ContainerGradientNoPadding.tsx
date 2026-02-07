"use client";
import { Box } from "@mui/material";
import { useEra } from "@/context/EraContext";

export const ContainerGradientNoPadding = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { currentEra } = useEra();

  return (
    <Box
      sx={{
        background: currentEra.gradient,
        transition: "background 0.5s ease",
      }}
    >
      {children}
    </Box>
  );
};

export default ContainerGradientNoPadding;
