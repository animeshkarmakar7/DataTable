import React from 'react';
import { SelectionProvider } from './context/SelectionContext';
import ArtworksPage from './pages/ArtworksPage';

export default function App() {
  return (
    <SelectionProvider>
      <ArtworksPage />
    </SelectionProvider>
  );
}
