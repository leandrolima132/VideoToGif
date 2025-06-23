'use client';

import React from 'react';
import { VideoConverterViewModel } from '../viewmodels/video-converter.viewmodel';
import Image from 'next/image';

interface PreviewSectionProps {
  viewModel: VideoConverterViewModel;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({ viewModel }) => {

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-blue-600">👁️</span> Preview
      </h2>

      {viewModel.video.previewUrl && !viewModel.gif.url && (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-gray-600 font-medium">Vídeo Original:</p>
          <div className="w-full flex justify-center">
            <video
              src={viewModel.video.previewUrl}
              controls
              className="max-w-full rounded-xl shadow-md"
              style={{
                maxHeight: '280px',
                height: 'auto',
                width: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      )}

      {viewModel.gif.url && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-green-700 mb-4">
              🎉 GIF Criado com Sucesso!
            </p>
            <div className="inline-block p-2 bg-gray-100 rounded-xl">
              <Image
                src={viewModel.gif.url}
                alt="GIF gerado"
                width={400}
                height={300}
                className="object-contain max-h-full max-w-full"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <a
              href={viewModel.gif.url}
              download={viewModel.gif.fileName}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
            >
              ⬇️ Baixar GIF
            </a>

            <button
              onClick={viewModel.copyGifAsPng}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 transition"
            >
              📋 Copiar como PNG
            </button>
          </div>

          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              viewModel.clearVideo();

            }}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
          >
            🔄 Converter Outro Vídeo
          </button> */}
        </div>
      )}

      {!viewModel.video.previewUrl && !viewModel.gif.url && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-4">🎬</div>
          <p>Selecione um vídeo para ver o preview</p>
        </div>
      )}
    </div>
  );
};