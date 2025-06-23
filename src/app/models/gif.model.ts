export interface GifModel {
  url: string | null;
  fileName: string;
  blob: Blob | null;
  size?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}