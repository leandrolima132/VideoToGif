'use client';

import React from 'react';
import { VideoConverterViewModel } from '../viewmodels/video-converter.viewmodel';
import { ProgressBar } from './progressbar';
import { FeedbackDisplay } from './feedback-display';
import { SettingsSection } from './settings-section';


interface UploadSectionProps {
  viewModel: VideoConverterViewModel;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  viewModel,
  fileInputRef
}) => {
  const {
    video,
    conversionState: { isLoading },

  } = viewModel;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) viewModel.selectVideo(file);
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) viewModel.selectVideo(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    viewModel.convertToGif();
  };
  // Component implementation
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-purple-600">📁</span>
        Upload do Vídeo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
            ${video?.file ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {video?.file ? (
            <div className="space-y-3">
              <div className="text-4xl">✅</div>
              <p className="font-medium text-green-700 truncate max-w-full" title={video.name}>
                {video.name}
              </p>
              <p className="text-sm text-green-600">
                {(video.size / (1024 * 1024)).toFixed(2)} MB
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  viewModel.clearVideo();
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
              >
                🗑️ Remover
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-4xl">📤</div>
              <p className="font-medium text-gray-700">Clique ou arraste um vídeo aqui</p>
              <p className="text-sm text-gray-500">Suporta MP4, MOV, AVI, WebM e outros formatos</p>
            </div>
          )}
        </div>

        <ProgressBar progress={viewModel.conversionState.progress} />

        <FeedbackDisplay message={viewModel.conversionState.feedback} />

        <SettingsSection viewModel={viewModel} />

        {/* Botão de conversão */}
        <button
          type="submit"
          disabled={!viewModel.video?.file || isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Convertendo...
            </>
          ) : (
            <>⚡ Converter para GIF</>
          )}
        </button>
      </form>
    </div>

  );
};