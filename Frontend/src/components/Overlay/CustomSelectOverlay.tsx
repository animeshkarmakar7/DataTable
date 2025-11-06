import React, { useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Artwork } from '../../types/types';
import { useSelection } from '../../context/SelectionContext';
import './CustomSelectOverlay.css';

type Props = {
  rows: Artwork[];
};

export default function CustomSelectOverlay({ rows }: Props) {
  const panelRef = useRef<OverlayPanel>(null);
  const [count, setCount] = useState<number | null>(null);

  const { selectedIds, setSelectedIds, setBulkRemaining, bulkRemaining, clearAll } =
    useSelection();

  function open(e: React.MouseEvent<HTMLButtonElement>) {
    panelRef.current?.toggle(e);
  }

  function apply() {
    const n = typeof count === 'number' ? Math.max(0, Math.floor(count)) : 0;
    if (n === 0) return;

    let remaining = n;
    const next = new Set<number>(selectedIds);

    for (const r of rows) {
      if (remaining === 0) break;
      if (!next.has(r.id)) {
        next.add(r.id);
        remaining -= 1;
      }
    }

    setSelectedIds(next);
    setBulkRemaining(bulkRemaining + remaining);
    setCount(null);
    panelRef.current?.hide();
  }

  function clearSelection() {
    clearAll();
    setCount(null);
    panelRef.current?.hide();
  }

  return (
    <>
      <div className="overlay-actions">
        <button className="plain-button" onClick={open}>Custom Select</button>
      </div>

      <OverlayPanel ref={panelRef} dismissable closeOnEscape>
        <div className="overlay-content">
          <div className="field">
            <label>Number of rows to select</label>
            <InputNumber value={count} onValueChange={(e: { value: any; }) => setCount(e.value ?? null)} min={0} />
          </div>
          <div className="buttons">
            <Button label="Apply" onClick={apply} />
            <Button label="Clear All" onClick={clearSelection} severity="secondary" outlined />
          </div>
          <p className="hint">
            If the number exceeds the visible rows, remaining selections will be applied automatically on next pages as they load. No extra pages are fetched in advance.
          </p>
        </div>
      </OverlayPanel>
    </>
  );
}
