'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Era, ERAS } from '@/constants/eras';

interface EraContextType {
  currentEra: Era;
  setEra: (eraId: string) => void;
}

const EraContext = createContext<EraContextType | undefined>(undefined);

export function EraProvider({ children }: { children: ReactNode }) {
  const [currentEra, setCurrentEra] = useState<Era>(ERAS[0]); // Default to Taylor Swift (Debut)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedEraId = localStorage.getItem('taylor-era');
    if (savedEraId) {
      const foundEra = ERAS.find((e) => e.id === savedEraId);
      if (foundEra) {
        setCurrentEra(foundEra);
      }
    }
    setMounted(true);
  }, []);

  const setEra = (eraId: string) => {
    const era = ERAS.find((e) => e.id === eraId);
    if (era) {
      setCurrentEra(era);
      localStorage.setItem('taylor-era', eraId);
    }
  };

  // Avoid hydration mismatch by rendering children only after mount, 
  // or accept that the initial render might differ. 
  // For themes, it's better to render immediately to avoid flash, 
  // but with localStorage we need to wait for mount or use a cookie.
  // Using a default era and updating is fine for now, 
  // or we can just return children directly and let the effect update the state.
  // However, `currentEra` changes will trigger re-renders.

  return (
    <EraContext.Provider value={{ currentEra, setEra }}>
      {children}
    </EraContext.Provider>
  );
}

export function useEra() {
  const context = useContext(EraContext);
  if (context === undefined) {
    throw new Error('useEra must be used within an EraProvider');
  }
  return context;
}
