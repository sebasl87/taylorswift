"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  ReactNode,
} from "react";
import { Era, ERAS } from "@/constants/eras";

// useLayoutEffect en browser (corre antes del paint), useEffect en servidor (SSR-safe)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface EraContextType {
  currentEra: Era;
  setEra: (eraId: string) => void;
}

const EraContext = createContext<EraContextType | undefined>(undefined);

export function EraProvider({ children }: { children: ReactNode }) {
  const [currentEra, setCurrentEra] = useState<Era>(ERAS[0]);

  useIsomorphicLayoutEffect(() => {
    const savedEraId = localStorage.getItem("taylor-era");
    if (savedEraId) {
      const foundEra = ERAS.find((e) => e.id === savedEraId);
      if (foundEra) {
        setCurrentEra(foundEra);
      }
    }
  }, []);

  const setEra = (eraId: string) => {
    const era = ERAS.find((e) => e.id === eraId);
    if (era) {
      setCurrentEra(era);
      localStorage.setItem("taylor-era", eraId);
    }
  };

  return (
    <EraContext.Provider value={{ currentEra, setEra }}>
      {children}
    </EraContext.Provider>
  );
}

export function useEra() {
  const context = useContext(EraContext);
  if (context === undefined) {
    throw new Error("useEra must be used within an EraProvider");
  }
  return context;
}
