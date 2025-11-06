import { useEffect } from 'react';
import { Artwork } from '../types/types';
import { useSelection } from '../context/SelectionContext';

export function usePersistentSelection(rows: Artwork[]) {
  const { selectedIds, setSelectedIds, bulkRemaining, setBulkRemaining } =
    useSelection();

  useEffect(() => {
    if (rows.length === 0 || bulkRemaining <= 0) return;

    let remaining = bulkRemaining;
    const next = new Set(selectedIds);

    for (const r of rows) {
      if (remaining === 0) break;
      if (!next.has(r.id)) {
        next.add(r.id);
        remaining -= 1;
      }
    }

    if (remaining !== bulkRemaining) {
      setSelectedIds(next);
      setBulkRemaining(remaining);
    }
  }, [rows, bulkRemaining, selectedIds, setSelectedIds, setBulkRemaining]);
}
