export interface ConversionSettings {
  speed: number;
  quality: 'low' | 'medium' | 'high';
  size: 'small' | 'medium' | 'large';
  startTime?: number;
  endTime?: number;
  loop?: boolean;
}

export interface QualitySettings {
  fps: number;
  scale: string;
  bitrate?: string;
}