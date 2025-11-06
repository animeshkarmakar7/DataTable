import React, { createContext, useContext, useMemo, useState } from 'react';

type SelectionContextValue = {
  selectedIds: Set<number>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<number>>>;
  bulkRemaining: number;
  setBulkRemaining: React.Dispatch<React.SetStateAction<number>>;
  clearAll: () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkRemaining, setBulkRemaining] = useState<number>(0);

  const value = useMemo<SelectionContextValue>(
    () => ({
      selectedIds,
      setSelectedIds,
      bulkRemaining,
      setBulkRemaining,
      clearAll: () => {
        setSelectedIds(new Set());
        setBulkRemaining(0);
      }
    }),
    [selectedIds, bulkRemaining]
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelection must be used within SelectionProvider');
  return ctx;
}
