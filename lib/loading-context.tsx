"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean; 
  startLoading: (duration?: number) => void; 
  stopLoading: () => void;
  loadingDuration: number; 
}

// ini konteksnya, defaultnya undefined biar ketauan klo lupa pasang provider
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  // state utama buat nyimpen status loading di seluruh app
  const [isLoading, setIsLoading] = useState(false);
  // default durasi loading 
  const [loadingDuration, setLoadingDuration] = useState(1000);

  // buat trigger loading & bisa nerima durasi custom
  const startLoading = (duration: number = 1000) => {
    setIsLoading(true);
    setLoadingDuration(duration);
  };
  
  // buat matiin overlay loading
  const stopLoading = () => setIsLoading(false);

  return (
    // bagiin state ke seluruh komponen yang diwrap
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading, loadingDuration }}>
      {children}
    </LoadingContext.Provider>
  );
}

// gw bikin ini biar pakenya gampang di komponen lain
export function useLoading() {
  const context = useContext(LoadingContext);
  // mastiin providernya udah dipasang di layout.tsx
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}