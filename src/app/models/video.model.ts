export interface VideoModel {
  file: File | null;
  previewUrl: string | null;
  name: string;
  size: number;
  duration?: number;
  format?: string;
}

export interface VideoValidation {
  isValid: boolean;
  errors: string[];
  maxSize: number;
  allowedFormats: readonly string[];
}