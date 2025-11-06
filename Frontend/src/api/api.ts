import { Artwork, ApiResponse } from '@types/types';

const BASE_URL = 'https://api.artic.edu/api/v1/artworks';

export async function fetchArtworks(page: number): Promise<{
  rows: Artwork[];
  total: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}> {
  const res = await fetch(`${BASE_URL}?page=${page}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch page ${page}`);
  }

  const json: ApiResponse = await res.json();

  const rows: Artwork[] = json.data.map((d) => ({
    id: d.id,
    title: d.title ?? '',
    place_of_origin: d.place_of_origin ?? '',
    artist_display: d.artist_display ?? '',
    inscriptions: d.inscriptions ?? 'N/A',
    date_start: d.date_start ?? null,
    date_end: d.date_end ?? null
  }));

  const p = json.pagination;
  return {
    rows,
    total: p.total,
    currentPage: p.current_page,
    perPage: p.limit,
    totalPages: p.total_pages
  };
}
