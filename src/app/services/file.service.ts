import { CONVERSION_CONSTANTS } from "../lib/constants";
import { VideoValidation } from "../models/video.model";

export class FileService {
  static validateVideo(file: File): VideoValidation {
    const errors: string[] = [];

    if (file.size > CONVERSION_CONSTANTS.MAX_FILE_SIZE) {
      errors.push(`O arquivo excede o tamanho máximo de ${this.formatFileSize(CONVERSION_CONSTANTS.MAX_FILE_SIZE)}.`);
    }

    if (!CONVERSION_CONSTANTS.ALLOWED_VIDEO_FORMATS.some(format => format === file.type)) {
      errors.push(`Formato não suportado: ${file.type}.`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      maxSize: CONVERSION_CONSTANTS.MAX_FILE_SIZE,
      allowedFormats: CONVERSION_CONSTANTS.ALLOWED_VIDEO_FORMATS
    };
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getVideoMetadata(file: File): Promise<{
    duration: number;
    width: number;
    height: number;
  }> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight
        });
      };

      video.onerror = () => {
        reject(new Error('Não foi possível carregar os metadados do vídeo.'));
      };

      video.src = URL.createObjectURL(file);
    });
  }
}