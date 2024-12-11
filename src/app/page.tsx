'use client'
import { ChangeEvent, FormEvent, useState } from "react";
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setVideo(e.target.files[0]);
    }
  };

  const handleSpeedChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSpeed(parseFloat(e.target.value));
  };

  const createGifFromVideo = async () => {
    if (!video) return;

    setLoading(true);
    setFeedback("Iniciando a conversão...");

    try {
      const ffmpeg = new FFmpeg();
      setFeedback("Carregando FFmpeg...");
      await ffmpeg.load();

      setFeedback("Carregando o arquivo de vídeo...");
      const videoBlob = await fetchFile(video);
      const videoName = video.name;

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().replace(/[^\w]/g, "-");
      const outputFileName = `${formattedDate}.gif`;

      ffmpeg.writeFile(videoName, new Uint8Array(videoBlob));

      setFeedback("Processando vídeo para GIF...");
      const command = [
        '-i', videoName,
        '-vf', `fps=10,scale=320:-1,setpts=PTS/${speed}`,
        outputFileName
      ];

      await ffmpeg.exec(command);

      setFeedback("Finalizando a conversão...");

      const outputData = await ffmpeg.readFile(outputFileName);

      const blob = new Blob([outputData], { type: 'image/gif' });
      const gifUrl = URL.createObjectURL(blob);

      setGifUrl(gifUrl);
      setGifFileName(outputFileName);
      setLoading(false);
      setFeedback("GIF criado com sucesso!");
    } catch (error) {
      console.error('Error creating GIF:', error);
      setLoading(false);
      setFeedback("Erro ao criar o GIF. Tente novamente.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!video) return;
    setGifUrl(null);
    setGifFileName("");
    await createGifFromVideo();
  };

  return (
    <div className="grid grid-rows-[1fr_auto_1fr] items-center justify-items-center min-h-screen bg-gray-50 p-8 sm:p-16 gap-12">
      <main className="flex flex-col items-center gap-6 sm:gap-8 max-w-3xl w-full text-center sm:text-left">
        <h1 className="text-4xl font-bold text-gray-800">Converter Vídeo em GIF</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center sm:items-start gap-4 w-full max-w-md">
          <input
            type="file"
            onChange={handleFileChange}
            accept="video/*"
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="block w-full text-left">
            <span className="text-gray-700">Velocidade:</span>
            <select
              value={speed}
              onChange={handleSpeedChange}
              className="mt-2 block w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0.5}>0.5x (Mais Lento)</option>
              <option value={1}>1x (Normal)</option>
              <option value={1.5}>1.5x (Rápido)</option>
              <option value={2}>2x (Muito Rápido)</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Convertendo...' : 'Converter'}
          </button>
        </form>

        {feedback && (
          <div className="mt-4 text-lg text-gray-600">
            <p>{feedback}</p>
          </div>
        )}

        {gifUrl && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">GIF Resultado:</h2>
            <Image
              src={gifUrl}
              alt="GIF gerado"
              width={320}
              height={240}
              className="mt-4 max-w-full h-auto rounded-lg shadow-md"
            />
            <a
              href={gifUrl}
              download={gifFileName}
              className="mt-4 inline-block px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
            >
              Baixar GIF
            </a>
          </div>
        )}
      </main>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-gray-500">
        <p>&copy; 2024 Leandro Ferreira | Projeto de Conversão de Vídeo para GIF</p>
      </footer>
    </div>
  );
}
