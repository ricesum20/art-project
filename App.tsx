
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ArtworkGrid } from './components/ArtworkGrid';
import { searchArtworks } from './services/geminiService';
import type { Artwork } from './types';

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<string>('');

  const handleSearch = useCallback(async (theme: string) => {
    if (!theme) return;
    setIsLoading(true);
    setError(null);
    setArtworks([]);
    setCurrentTheme(theme);
    try {
      const results = await searchArtworks(theme);
      setArtworks(results);
    } catch (err) {
      console.error(err);
      setError('작품을 검색하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-200">
          <p className="text-center text-gray-600 mb-4">
            탐험하고 싶은 주제를 입력해보세요! AI가 주제에 맞는 전 세계의 명화들을 찾아줄 거예요.
          </p>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {error && (
          <div className="text-center my-8 p-4 bg-red-100 text-red-700 rounded-lg max-w-3xl mx-auto">
            {error}
          </div>
        )}

        <ArtworkGrid artworks={artworks} isLoading={isLoading} />

      </main>
      <footer className="text-center p-4 text-sm text-gray-500">
        © 2024 AI Art Explorer. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
