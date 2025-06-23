export class ClipboardService {
  static async copyGifAsPng(gifUrl: string) {
    try {
      const response = await fetch(gifUrl);
      const blob = await response.blob();

      const imageBitmap = await createImageBitmap(blob);

      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(imageBitmap, 0, 0);

      const pngBlob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Falha ao converter canvas para Blob'));
          }
        }, 'image/png');
      });

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': pngBlob
        })
      ]);

      console.log('Imagem PNG copiada com sucesso!');
    } catch (error) {
      console.error('Erro ao copiar imagem:', error);
    }
  }

  static async copyText(text: string): Promise<void> {
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not supported');
    }
    await navigator.clipboard.writeText(text);
  }

  static isClipboardSupported(): boolean {
    return 'clipboard' in navigator && 'ClipboardItem' in window;
  }
}