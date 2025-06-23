import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from "@ffmpeg/util";
import { ConversionSettings, QualitySettings } from '../models/conversion-settings.model';
import { CONVERSION_CONSTANTS } from '../lib/constants';


export class FFmpegService {
  private ffmpeg: FFmpeg | null = null;
  private static instance: FFmpegService;

  static getInstance(): FFmpegService {
    if (!FFmpegService.instance) {
      FFmpegService.instance = new FFmpegService();
    }
    return FFmpegService.instance;
  }

  async initialize(): Promise<void> {
    if (!this.ffmpeg) {
      this.ffmpeg = new FFmpeg();
      await this.ffmpeg.load();
    }
  }

  async convertVideoToGif(
    video: File,
    settings: ConversionSettings,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    // Implementation here
    if (!this.ffmpeg) throw new Error("FFmpeg not initialized");

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.gif';

    this.ffmpeg.writeFile(inputFileName, await fetchFile(video));

    if (onProgress) {
      this.ffmpeg.on('progress', ({ progress }) => {
        onProgress(progress * 100); // 0 ~ 1 → 0 ~ 100
      });
    }

    const quality = this.getQualitySettings(settings.quality);
    const size = this.getSizeSettings(settings.size);

    const args = [
      '-i', inputFileName,
      ...(typeof settings.startTime === 'number' ? ['-ss', `${settings.startTime}`] : []),
      ...(typeof settings.endTime === 'number' ? ['-to', `${settings.endTime}`] : []),
      '-vf', `fps=${quality.fps},scale=${size}`,
      '-loop', settings.loop ? '0' : '-1',
      outputFileName,
    ];

    await this.ffmpeg.exec(args);

    const data = await this.ffmpeg.readFile(outputFileName) as Uint8Array;

    return new Blob([data], { type: 'image/gif' });
  }

  private getQualitySettings(quality: ConversionSettings['quality']): QualitySettings {
    return CONVERSION_CONSTANTS.QUALITY_SETTINGS[quality];
  }

  private getSizeSettings(size: ConversionSettings['size']): string {
    return CONVERSION_CONSTANTS.SIZE_SETTINGS[size];
  }
}