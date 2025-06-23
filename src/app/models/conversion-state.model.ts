export interface ConversionState {
  isLoading: boolean;
  progress: number;
  feedback: string;
  error: string | null;
  stage: 'idle' | 'initializing' | 'processing' | 'finalizing' | 'completed' | 'error';
}