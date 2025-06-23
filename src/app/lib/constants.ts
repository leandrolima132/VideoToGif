export const CONVERSION_CONSTANTS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_VIDEO_FORMATS: ['video/mp4', 'video/mov', 'video/avi', 'video/webm'],
  QUALITY_SETTINGS: {
    low: { fps: 8, scale: '240:-1' },
    medium: { fps: 10, scale: '320:-1' },
    high: { fps: 15, scale: '480:-1' }
  },
  SIZE_SETTINGS: {
    small: '240:-1',
    medium: '320:-1',
    large: '480:-1'
  }
} as const;