"use client";

import { useEffect, useState } from "react";

// hook utk nunda update value sampe user berenti ngetik selama delay 300 ms
export function useDebounce<T>(value: T, delay: number = 300): T {
  // state utk nampung nilai yg gak berubah terus
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // tiap kli user ngetik, set timer baru buat update value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // klo user ngetik sblm delay kelar, 
    // timer lama diapus biar gak spam update
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // jalan lg tiap value/delaynya berubah

  return debouncedValue;
}