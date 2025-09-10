
import React, { useState } from 'react';
import type { Artwork } from '../types';
import { generateColoringPage } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

interface ColoringPageGeneratorProps {
  artwork: Artwork;
}

export const ColoringPageGenerator: React.FC<ColoringPageGeneratorProps> = ({ artwork }) => {
  // FIX: To resolve the type error on line 23, the component's state and UI have been updated.
  // The 'coloringTheme' string state was replaced with a 'level' state of type `'lower' | 'upper'`.
  // The free-form text input was replaced with a dropdown select to ensure only valid options are passed to the `generateColoringPage` function.
  const [level, setLevel] = useState<'lower' | 'upper'>('lower');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageBase64 = await generateColoringPage(artwork, level);
      setGeneratedImage(imageBase64);
    } catch (err) {
      setError('도안 생성에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label htmlFor="coloring-level" className="block text-sm font-medium text-gray-700">도안 난이도 선택:</label>
      <select
        id="coloring-level"
        value={level}
        onChange={(e) => setLevel(e.target.value as 'lower' | 'upper')}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
        disabled={isLoading}
      >
        <option value="lower">저학년용</option>
        <option value="upper">고학년용</option>
      </select>
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full bg-rose-500 text-white font-bold py-2 px-4 rounded-full hover:bg-rose-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? '도안 그리는 중...' : '생성'}
      </button>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-4">
          <LoadingSpinner />
          <p className="mt-2 text-sm text-gray-600">AI가 열심히 그림을 그리고 있어요!</p>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      
      {generatedImage && (
        <div className="mt-4 border-t pt-4">
            <h4 className="font-bold text-center mb-2">완성된 컬러링 도안!</h4>
          <img
            src={`data:image/png;base64,${generatedImage}`}
            alt="Generated Coloring Page"
            className="w-full rounded-lg border-2 border-gray-200"
          />
        </div>
      )}
    </div>
  );
};
