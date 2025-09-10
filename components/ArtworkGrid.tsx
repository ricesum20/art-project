
import React from 'react';
import type { Artwork } from '../types';
import { ArtworkCard } from './ArtworkCard';
import { LoadingSpinner } from './LoadingSpinner';

interface ArtworkGridProps {
  artworks: Artwork[];
  isLoading: boolean;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="bg-gray-200 w-full h-64"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-8 text-center">
        <div className="inline-block">
            <LoadingSpinner />
        </div>
        <p className="text-amber-700 font-semibold mt-4 text-lg">AI가 주제에 맞는 명작들을 찾고 있어요...</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center mt-12 text-gray-500">
        <p>어떤 주제로 미술 여행을 떠나볼까요?</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
      {artworks.map((artwork, index) => (
        <ArtworkCard key={`${artwork.title}-${index}`} artwork={artwork} />
      ))}
    </div>
  );
};
