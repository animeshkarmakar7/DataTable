import React from 'react';
import { fetchArtworks } from '../api/api';
import { useSelection } from '../context/SelectionContext';
import ArtworkTable from '../components/DataTable/ArtWorkTable';
import CustomSelectOverlay from '../components/Overlay/CustomSelectOverlay';
import { usePersistentSelection } from '../hooks/useSelection';
import { Artwork } from '../types/types';

export default function ArtworksPage() {
  const [page, setPage] = React.useState(1);
  const [rows, setRows] = React.useState<Artwork[]>([]);
  const [total, setTotal] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);
  const [loading, setLoading] = React.useState(false);

  const { selectedIds, setSelectedIds } = useSelection();

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchArtworks(page)
      .then((r) => {
        if (cancelled) return;
        setRows(r.rows);
        setTotal(r.total);
        setRowsPerPage(r.perPage);
      })
      .catch(() => {
        if (!cancelled) {
          setRows([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  usePersistentSelection(rows);

  return (
    <div>
      <header className="page-header">
        <h1>Artworks</h1>
      </header>

      <CustomSelectOverlay rows={rows} />

      <ArtworkTable
        rows={rows}
        totalRecords={total}
        page={page}
        rowsPerPage={rowsPerPage}
        loading={loading}
        onPageChange={setPage}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
    </div>
  );
}