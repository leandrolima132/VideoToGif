'use client';

import React from 'react';
import { VideoConverterViewModel } from '../viewmodels/video-converter.viewmodel';

interface SettingsSectionProps {
  viewModel: VideoConverterViewModel;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ viewModel }) => {
  const { settings } = viewModel;

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    viewModel.updateSettings({ speed: parseFloat(e.target.value) });
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    viewModel.updateSettings({ quality: e.target.value as 'low' | 'medium' | 'high' });
  };

  const handleSizeChange = (size: 'small' | 'medium' | 'large') => {
    viewModel.updateSettings({ size });
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Velocidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🚀 Velocidade
          </label>
          <select
            value={settings.speed}
            onChange={handleSpeedChange}
            className="w-full border border-gray-300 text-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value={0.5}>0.5x (Mais lento)</option>
            <option value={1}>1x (Normal)</option>
            <option value={1.5}>1.5x (Rápido)</option>
            <option value={2}>2x (Muito rápido)</option>
          </select>
        </div>

        {/* Qualidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⚡ Qualidade
          </label>
          <select
            value={settings.quality}
            onChange={handleQualityChange}
            className="w-full border border-gray-300 text-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="low">Baixa (Menor arquivo)</option>
            <option value="medium">Média (Balanceado)</option>
            <option value="high">Alta (Melhor qualidade)</option>
          </select>
        </div>
      </div>

      {/* Tamanho */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📐 Tamanho
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['small', 'medium', 'large'] as const).map((sizeOption) => (
            <button
              key={sizeOption}
              type="button"
              onClick={() => handleSizeChange(sizeOption)}
              className={`p-3 rounded-xl border-2 transition font-medium ${settings.size === sizeOption
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-400'
                }`}
            >
              {sizeOption === 'small' && '📱 Pequeno'}
              {sizeOption === 'medium' && '💻 Médio'}
              {sizeOption === 'large' && '🖥️ Grande'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
