
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (theme: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [theme, setTheme] = useState('');
  const [showAgainButton, setShowAgainButton] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (theme.trim() && !isLoading) {
      onSearch(theme.trim());
      setShowAgainButton(true);
    }
  };
  
  const handleSearchAgain = () => {
    if (theme.trim() && !isLoading) {
      onSearch(theme.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="예: 행복, 우주, 동물"
        className="flex-grow w-full px-4 py-3 border border-amber-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
        disabled={isLoading}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="w-full sm:w-auto bg-amber-600 text-white font-bold px-6 py-3 rounded-full hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
          disabled={isLoading || !theme.trim()}
        >
          {isLoading ? '탐색중...' : '작품 찾기'}
        </button>
        {showAgainButton && (
          <button
            type="button"
            onClick={handleSearchAgain}
            className="w-full sm:w-auto bg-green-600 text-white font-bold px-6 py-3 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            disabled={isLoading}
          >
            다시 검색
          </button>
        )}
      </div>
    </form>
  );
};
