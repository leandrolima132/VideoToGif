export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateFileName(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().replace(/[^\w]/g, "-");
  return `${prefix}-${timestamp}.${extension}`;
}