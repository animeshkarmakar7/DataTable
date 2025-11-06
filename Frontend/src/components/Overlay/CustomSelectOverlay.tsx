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

  const { selectedIds, setSelectedIds, setBulkRemaining, clearAll } =
    useSelection();

  function open(e: React.MouseEvent<HTMLButtonElement>) {
    panelRef.current?.toggle(e);
  }

  function apply() {
    const n = typeof count === 'number' ? Math.max(0, Math.floor(count)) : 0;
    if (n === 0) {
      alert('Please enter a number greater than 0');
      return;
    }

    let remaining = n;
    const next = new Set<number>(selectedIds);

    // Select from current page first
    for (const r of rows) {
      if (remaining === 0) break;
      if (!next.has(r.id)) {
        next.add(r.id);
        remaining -= 1;
      }
    }

    setSelectedIds(next);
    setBulkRemaining(remaining);
    setCount(null);
    panelRef.current?.hide();

    // Show success message
    const selected = n - remaining;
    if (selected > 0) {
      alert(`Selected ${selected} row${selected !== 1 ? 's' : ''} from current page.${remaining > 0 ? ` ${remaining} more will be selected from next pages.` : ''}`);
    }
  }

  function clearSelection() {
    clearAll();
    setCount(null);
    panelRef.current?.hide();
  }

  return (
    <>
      <div className="overlay-actions">
        <button className="plain-button" onClick={open}>
          <i className="pi pi-check-square" style={{ marginRight: '0.5rem' }}></i>
          Custom Select
        </button>
      </div>

      <OverlayPanel ref={panelRef} dismissable closeOnEscape>
        <div className="overlay-content">
          <div className="overlay-header">
            <h3>Select Multiple Rows</h3>
          </div>
          
          <div className="field">
            <label htmlFor="row-count">Number of rows to select</label>
            <InputNumber 
              id="row-count"
              value={count} 
              onValueChange={(e) => setCount(e.value ?? null)} 
              min={0} 
              max={9999}
              placeholder="Enter number"
              showButtons
              buttonLayout="horizontal"
              step={1}
              decrementButtonClassName="p-button-secondary"
              incrementButtonClassName="p-button-secondary"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
            />
          </div>
          
          <div className="buttons">
            <Button 
              label="Apply" 
              icon="pi pi-check"
              onClick={apply} 
              disabled={!count || count <= 0}
            />
            <Button 
              label="Clear All" 
              icon="pi pi-times"
              onClick={clearSelection} 
              severity="secondary" 
              outlined 
            />
          </div>
          
          <div className="hint-box">
            <i className="pi pi-info-circle"></i>
            <p className="hint">
              If the number exceeds visible rows, remaining selections will be applied automatically as you navigate to next pages. No extra pages are fetched in advance.
            </p>
          </div>
        </div>
      </OverlayPanel>
    </>
  );
}