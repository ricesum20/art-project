
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-amber-100 p-4 shadow-md">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-amber-800">
          🎨 AI 미술 탐험
        </h1>
        <p className="text-amber-700 mt-1">명화와 함께 떠나는 창의력 여행</p>
      </div>
    </header>
  );
};
