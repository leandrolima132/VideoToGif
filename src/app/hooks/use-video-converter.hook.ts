"use client"
import { useState, useRef, useMemo } from 'react';
import { VideoConverterViewModel } from '../viewmodels/video-converter.viewmodel';
import { VideoModel } from '../models/video.model';
import { GifModel } from '../models/gif.model';
import { ConversionSettings } from '../models/conversion-settings.model';
import { ConversionState } from '../models/conversion-state.model';

type StateType = {
  video: VideoModel;
  gif: GifModel;
  settings: ConversionSettings;
  conversionState: ConversionState;
};

export function useVideoConverter() {
  const [state, setState] = useState<StateType>({
    video: { file: null, previewUrl: null, name: '', size: 0 },
    gif: { url: null, fileName: '', blob: null },
    settings: { speed: 1, quality: 'medium', size: 'medium' },
    conversionState: { isLoading: false, progress: 0, feedback: '', error: null, stage: 'idle' }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);


  const viewModel = useMemo(() => {
    const vm = new VideoConverterViewModel((updates) => {
      setState(prev => ({ ...prev, ...updates }));
    });

    // Atualiza as propriedades do VM para o state atual
    vm.video = state.video;
    vm.gif = state.gif;
    vm.settings = state.settings;
    vm.conversionState = state.conversionState;

    return vm;
  }, [state]);

  return {
    viewModel,
    fileInputRef,
    video: state.video,
    gif: state.gif,
    settings: state.settings,
    conversionState: state.conversionState
  };
}
