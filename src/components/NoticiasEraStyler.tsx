"use client";

import React, { useEffect } from "react";
import { useEra } from "@/context/EraContext";

interface Props {
  containerId?: string;
}

export default function NoticiasEraStyler({
  containerId = "noticia-root",
}: Props) {
  const { currentEra } = useEra();

  useEffect(() => {
    const el = document.getElementById(containerId);
    if (!el) return;

    // Aplicar colores de la era al contenedor (fondo y texto)
    if (currentEra?.colors?.heroOverlay) {
      el.style.background = currentEra.colors.heroOverlay;
    }
    if (currentEra?.colors?.heroText) {
      el.style.color = currentEra.colors.heroText;
    }
    if (currentEra?.shadowColor) {
      el.style.setProperty("--era-shadow", currentEra.shadowColor);
    }

    return () => {
      // limpiar cambios al desmontar
      if (el) {
        el.style.background = "";
        el.style.color = "";
        el.style.removeProperty("--era-shadow");
      }
    };
  }, [currentEra, containerId]);

  return null;
}
