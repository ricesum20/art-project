import React, { useState } from 'react';
import type { Artwork } from '../types';
import { generateColoringPage } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

interface ArtworkCardProps {
  artwork: Artwork;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const [generatingLevel, setGeneratingLevel] = useState<'lower' | 'upper' | null>(null);
  const [coloringPageImage, setColoringPageImage] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const imageUrl = `data:image/png;base64,${artwork.image}`;
  const googleSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
    `${artwork.title} ${artwork.artist}`
  )}`;

  const handleGenerateClick = async (level: 'lower' | 'upper') => {
    if (generatingLevel) return;

    setGeneratingLevel(level);
    setGenerationError(null);
    setColoringPageImage(null);
    try {
      const imageBase64 = await generateColoringPage(artwork, level);
      setColoringPageImage(imageBase64);
    } catch (err) {
      setGenerationError('도안 생성에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setGeneratingLevel(null);
    }
  };

  const handleDownloadClick = () => {
    if (!coloringPageImage) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${coloringPageImage}`;
    link.download = `${artwork.title.replace(/\s/g, '_')}_coloring_page.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <img src={imageUrl} alt={artwork.title} className="w-full h-64 object-cover" />
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-amber-900">{artwork.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{artwork.artist}</p>
        <p className="text-gray-700 text-sm flex-grow">{artwork.description}</p>
        
        <div className="mt-4 space-y-2">
            <a
              href={googleSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-sky-500 text-white font-bold py-2 px-4 rounded-full hover:bg-sky-600 transition-colors"
            >
              원본 작품 보기
            </a>
            <div className="grid grid-cols-2 gap-2">
                 <button
                    onClick={() => handleGenerateClick('lower')}
                    className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-full hover:bg-teal-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={generatingLevel !== null}
                >
                    {generatingLevel === 'lower' ? '만드는 중...' : '저학년용 도안'}
                </button>
                <button
                    onClick={() => handleGenerateClick('upper')}
                    className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={generatingLevel !== null}
                >
                    {generatingLevel === 'upper' ? '만드는 중...' : '고학년용 도안'}
                </button>
            </div>
        </div>

        {generatingLevel && (
            <div className="flex flex-col items-center justify-center p-4 mt-4 border-t-2 border-amber-100 pt-4">
                <LoadingSpinner />
                <p className="mt-2 text-sm text-gray-600">AI가 {generatingLevel === 'lower' ? '저학년용' : '고학년용'} 도안을 그리고 있어요!</p>
            </div>
        )}
        
        {generationError && <p className="mt-4 text-sm text-red-600 text-center">{generationError}</p>}
        
        {coloringPageImage && !generatingLevel && (
            <div className="mt-4 border-t-2 border-amber-100 pt-4 space-y-3">
                <h4 className="font-bold text-center">완성된 컬러링 도안!</h4>
                <img
                    src={`data:image/png;base64,${coloringPageImage}`}
                    alt="Generated Coloring Page"
                    className="w-full rounded-lg border-2 border-gray-200"
                />
                <button
                    onClick={handleDownloadClick}
                    className="w-full bg-rose-500 text-white font-bold py-2 px-4 rounded-full hover:bg-rose-600 transition-colors"
                >
                    다운로드
                </button>
            </div>
        )}

      </div>
    </div>
  );
};