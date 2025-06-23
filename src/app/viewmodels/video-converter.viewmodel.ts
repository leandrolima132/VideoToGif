/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConversionSettings } from "../models/conversion-settings.model";
import { ConversionState } from "../models/conversion-state.model";
import { GifModel } from "../models/gif.model";
import { VideoModel } from "../models/video.model";
import { ClipboardService } from "../services/clipboard.service";
import { FFmpegService } from "../services/ffmpeg.service";
import { FileService } from "../services/file.service";

export class VideoConverterViewModel {
  // Properties
  public video: VideoModel;
  public gif: GifModel;
  public settings: ConversionSettings;
  public conversionState: ConversionState;

  // Dependencies
  private ffmpegService: FFmpegService;

  constructor(
    private updateState: (updates: Partial<{
      video: VideoModel;
      gif: GifModel;
      settings: ConversionSettings;
      conversionState: ConversionState;
    }>) => void
  ) {
    this.ffmpegService = FFmpegService.getInstance();
    // Initialize default state
    this.video = { file: null, previewUrl: null, name: '', size: 0 };
    this.gif = { url: null, fileName: '', blob: null };
    this.settings = { speed: 1, quality: 'medium', size: 'medium' };
    this.conversionState = {
      isLoading: false,
      progress: 0,
      feedback: '',
      error: null,
      stage: 'idle'
    };
  }

  // Actions
  async selectVideo(file: File): Promise<void> {
    const validation = FileService.validateVideo(file);
    if (!validation.isValid) {
      this.updateState({
        conversionState: {
          ...this.conversionState,
          feedback: validation.errors.join(', '),
          error: validation.errors.join(', '),
          stage: 'error',
        },
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const metadata = await FileService.getVideoMetadata(file);

    const videoModel: VideoModel = {
      file,
      previewUrl,
      name: file.name,
      size: file.size,
      duration: metadata.duration,
      format: file.type,
    };

    this.updateState({
      video: videoModel,
      conversionState: {
        isLoading: false,
        progress: 0,
        feedback: 'Vídeo carregado!',
        error: null,
        stage: 'idle',
      },
    });
  }

  clearVideo(): void {
    this.updateState({
      video: { file: null, previewUrl: null, name: '', size: 0 },
      gif: { url: null, fileName: '', blob: null },
      conversionState: {
        isLoading: false,
        progress: 0,
        feedback: '',
        error: null,
        stage: 'idle',
      },
    });
  }

  updateSettings(updates: Partial<ConversionSettings>): void {
    this.updateState({
      settings: {
        ...this.settings,
        ...updates,
      },
    });
  }

  async convertToGif(): Promise<void> {
    if (!this.video?.file) return;

    this.updateState({
      conversionState: {
        ...this.conversionState,
        isLoading: true,
        progress: 0,
        feedback: 'Inicializando conversão...',
        error: null,
        stage: 'initializing',
      },
    });

    try {
      await this.ffmpegService.initialize();

      const blob = await this.ffmpegService.convertVideoToGif(
        this.video.file,
        this.settings,
        (progress) => {
          const rounded = Math.round(progress);
          this.updateState({
            conversionState: {
              ...this.conversionState,
              progress,
              stage: 'processing',
              feedback: `Conversão em andamento... ${rounded}%`,
            },
          });
        }
      );

      const gifUrl = URL.createObjectURL(blob);

      const gifModel: GifModel = {
        url: gifUrl,
        blob,
        fileName: this.video.name.replace(/\.[^/.]+$/, '.gif'),
      };

      this.updateState({
        gif: gifModel,
        conversionState: {
          isLoading: false,
          progress: 100,
          feedback: '🎉 Conversão concluída!',
          error: null,
          stage: 'completed',
        },
      });
    } catch (error: any) {
      this.updateState({
        conversionState: {
          isLoading: false,
          progress: 0,
          feedback: '❌ Erro ao converter o vídeo.',
          error: error?.message || 'Erro desconhecido',
          stage: 'error',
        },
      });
    }

  }

  async copyGifAsPng(): Promise<void> {
    if (!this.gif?.url) return;
    await ClipboardService.copyGifAsPng(this.gif.url);
    this.updateState({
      conversionState: {
        ...this.conversionState,
        feedback: '📋 Frame copiado como PNG!',
      },
    });
  }

  downloadGif(): void {
    if (!this.gif?.blob || !this.gif?.fileName) return;

    const url = window.URL.createObjectURL(this.gif.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.gif.fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  setSpeed(speed: number): void {
    this.updateSettings({ speed });
  }

  setQuality(quality: 'low' | 'medium' | 'high'): void {
    this.updateSettings({ quality });
  }

  setSize(size: 'small' | 'medium' | 'large'): void {
    this.updateSettings({ size });
  }
}