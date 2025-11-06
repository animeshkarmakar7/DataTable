import React from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Artwork } from '@types/types';
import './ArtworkTable.css';

type Props = {
  rows: Artwork[];
  totalRecords: number;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  selectedIds: Set<number>;
  setSelectedIds: (value: Set<number>) => void;
};

export default function ArtworkTable({
  rows,
  totalRecords,
  page,
  rowsPerPage,
  loading,
  onPageChange,
  selectedIds,
  setSelectedIds
}: Props) {
  const dataKey = 'id';

  const selectedRows = React.useMemo(
    () => rows.filter((r) => selectedIds.has(r.id)),
    [rows, selectedIds]
  );

  function handleSelectionChange(e: { value: Artwork[] }) {
    const next = new Set<number>(selectedIds);
    const currentIds = new Set(rows.map((r) => r.id));

    for (const id of currentIds) next.delete(id);
    for (const r of e.value) next.add(r.id);

    setSelectedIds(next);
  }

  function onPage(e: DataTablePageEvent) {
    const newPage = Math.floor(e.first / e.rows) + 1;
    onPageChange(newPage);
  }

  return (
    <div className="table-wrapper">
      <DataTable
        value={rows}
        dataKey={dataKey}
        loading={loading}
        paginator
        lazy
        totalRecords={totalRecords}
        first={(page - 1) * rowsPerPage}
        rows={rowsPerPage}
        onPage={onPage}
        selectionMode="checkbox"
        selection={selectedRows}
        onSelectionChange={handleSelectionChange}
        showGridlines
        stripedRows
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="title" header="TITLE" />
        <Column field="place_of_origin" header="PLACE OF ORIGIN" />
        <Column field="artist_display" header="ARTIST" />
        <Column field="inscriptions" header="INSCRIPTIONS" />
        <Column field="date_start" header="START DATE" />
        <Column field="date_end" header="END DATE" />
      </DataTable>
    </div>
  );
}
