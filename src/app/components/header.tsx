'use client';

import React from 'react';

export function Header() {
  return (
    <header className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mx-auto mb-4">
        <span className="text-2xl">🎬</span>
      </div>
      <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
        Conversor de Vídeo para GIF
      </h1>
      <p className="text-gray-600 text-lg">
        Transforme seus vídeos em GIFs animados com qualidade profissional
      </p>
    </header>
  );
}
