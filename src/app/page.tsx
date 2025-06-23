'use client'
import { ChangeEvent, FormEvent, useState, useRef } from "react";
import { FFmpeg } from '@ffmpeg/ffmpeg';
import Image from "next/image";
import { fetchFile } from "@ffmpeg/util";

export default function Home() {
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [gifFileName, setGifFileName] = useState<string>("");
  const [speed, setSpeed] = useState<number>(1);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [progress, setProgress] = useState<number>(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
      setGifUrl(null); // Reset previous GIF
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('video/')) {
      setVideo(files[0]);
      setVideoPreview(URL.createObjectURL(files[0]));
      setGifUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getQualitySettings = () => {
    switch (quality) {
      case 'low': return { fps: 8, scale: '240:-1' };
      case 'medium': return { fps: 10, scale: '320:-1' };
      case 'high': return { fps: 15, scale: '480:-1' };
    }
  };

  const getSizeSettings = () => {
    switch (size) {
      case 'small': return '240:-1';
      case 'medium': return '320:-1';
      case 'large': return '480:-1';
    }
  };

  const createGifFromVideo = async () => {
    if (!video) return;

    setLoading(true);
    setProgress(0);
    setFeedback("Iniciando a conversão...");

    try {
      const ffmpeg = new FFmpeg();

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 200);

      setFeedback("Carregando FFmpeg...");
      await ffmpeg.load();

      setFeedback("Carregando o arquivo de vídeo...");
      const videoBlob = await fetchFile(video);
      const videoName = video.name;

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().replace(/[^\w]/g, "-");
      const outputFileName = `gif-${formattedDate}.gif`;

      ffmpeg.writeFile(videoName, new Uint8Array(videoBlob));

      setFeedback("Processando vídeo para GIF...");
      const qualitySettings = getQualitySettings();
      const sizeScale = getSizeSettings();

      const command = [
        '-i', videoName,
        '-vf', `fps=${qualitySettings.fps},scale=${sizeScale},setpts=PTS/${speed}`,
        '-loop', '0',
        outputFileName
      ];

      await ffmpeg.exec(command);

      setFeedback("Finalizando a conversão...");
      const outputData = await ffmpeg.readFile(outputFileName);

      const blob = new Blob([outputData], { type: 'image/gif' });
      const gifUrl = URL.createObjectURL(blob);

      clearInterval(progressInterval);
      setProgress(100);
      setGifUrl(gifUrl);
      setGifFileName(outputFileName);
      setLoading(false);
      setFeedback("🎉 GIF criado com sucesso!");
    } catch (error) {
      console.error('Error creating GIF:', error);
      setLoading(false);
      setProgress(0);
      setFeedback("❌ Erro ao criar o GIF. Tente novamente.");
    }
  };

  const handleCopyAsPng = async () => {
    try {
      if (!gifUrl) return;
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.src = gifUrl;

      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(async (blob) => {
          if (!blob) return alert('Falha ao converter GIF para PNG');
          const clipboardItem = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([clipboardItem]);
          setFeedback("📋 Primeiro frame copiado como PNG!");
        }, 'image/png');
      };

      img.onerror = () => {
        alert('Erro ao carregar o GIF');
      };
    } catch (err) {
      console.error(err);
      alert('Erro ao copiar imagem como PNG.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!video) return;
    await createGifFromVideo();
  };

  const clearVideo = () => {
    setVideo(null);
    setVideoPreview(null);
    setGifUrl(null);
    setGifFileName("");
    setFeedback("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mb-4">
            <span className="text-2xl">🎬</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Conversor de Vídeo para GIF
          </h1>
          <p className="text-gray-600 text-lg">Transforme seus vídeos em GIFs animados com qualidade profissional</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-purple-600">📁</span>
              Upload do Vídeo
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Drag & Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                  ${video ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {video ? (
                  <div className="space-y-3">
                    <div className="text-4xl">✅</div>
                    <p className="font-medium text-green-700">{video.name}</p>
                    <p className="text-sm text-green-600">
                      {(video.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearVideo();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                    >
                      🗑️ Remover
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-4xl">📤</div>
                    <p className="font-medium text-gray-700">Clique ou arraste um vídeo aqui</p>
                    <p className="text-sm text-gray-500">Suporta MP4, MOV, AVI, WebM e outros formatos</p>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🚀 Velocidade
                  </label>
                  <select
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full border border-gray-300 text-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value={0.5}>0.5x (Mais lento)</option>
                    <option value={1}>1x (Normal)</option>
                    <option value={1.5}>1.5x (Rápido)</option>
                    <option value={2}>2x (Muito rápido)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⚡ Qualidade
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full border border-gray-300 text-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">Baixa (Menor arquivo)</option>
                    <option value="medium">Média (Balanceado)</option>
                    <option value="high">Alta (Melhor qualidade)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📐 Tamanho
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'medium', 'large'] as const).map((sizeOption) => (
                    <button
                      key={sizeOption}
                      type="button"
                      onClick={() => setSize(sizeOption)}
                      className={`p-3 rounded-xl border-2 transition font-medium ${size === sizeOption
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-400'
                        }`}
                    >
                      {sizeOption === 'small' && '📱 Pequeno'}
                      {sizeOption === 'medium' && '💻 Médio'}
                      {sizeOption === 'large' && '🖥️ Grande'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Convert Button */}
              <button
                type="submit"
                disabled={!video || loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Convertendo...
                  </>
                ) : (
                  <>
                    ⚡ Converter para GIF
                  </>
                )}
              </button>

              {/* Progress Bar */}
              {loading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progresso</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700">{feedback}</p>
                </div>
              )}
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-blue-600">👁️</span>
              Preview
            </h2>

            {videoPreview && !gifUrl && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 font-medium">Vídeo Original:</p>
                <video
                  src={videoPreview}
                  controls
                  className="w-full rounded-xl shadow-md"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            {gifUrl && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-700 mb-4">🎉 GIF Criado com Sucesso!</p>
                  <div className="inline-block p-2 bg-gray-100 rounded-xl">
                    <Image
                      src={gifUrl}
                      alt="GIF gerado"
                      width={400}
                      height={300}
                      className="rounded-lg shadow-md max-w-full h-auto"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href={gifUrl}
                    download={gifFileName}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
                  >
                    ⬇️ Baixar GIF
                  </a>

                  <button
                    onClick={handleCopyAsPng}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 transition"
                  >
                    📋 Copiar como PNG
                  </button>
                </div>

                <button
                  onClick={clearVideo}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition"
                >
                  🔄 Converter Outro Vídeo
                </button>
              </div>
            )}

            {!videoPreview && !gifUrl && (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-4">🎬</div>
                <p>Selecione um vídeo para ver o preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">✨ Recursos Principais</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-800 mb-2">Conversão Rápida</h3>
              <p className="text-sm text-gray-600">Processamento otimizado com FFmpeg para resultados em segundos</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Controle Total</h3>
              <p className="text-sm text-gray-600">Ajuste velocidade, qualidade e tamanho conforme sua necessidade</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-800 mb-2">100% Seguro</h3>
              <p className="text-sm text-gray-600">Processamento local no seu navegador, sem upload para servidores</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 text-center text-sm text-gray-500 pb-8">
        &copy; 2024 Leandro Ferreira — Conversor de GIF com FFmpeg + Next.js
      </footer>
    </div>
  );
}