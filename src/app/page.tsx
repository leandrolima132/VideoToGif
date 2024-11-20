'use client'
import { ChangeEvent, FormEvent, useState } from "react";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import Image from "next/image";
import { fetchFile } from "@ffmpeg/util";

export default function Home() {
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [gifFileName, setGifFileName] = useState<string>("");

  // Handle video file change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setVideo(e.target.files[0]);
    }
  };

  // Function to create GIF from video
  const createGifFromVideo = async () => {
    if (!video) return;

    setLoading(true);
    setFeedback("Iniciando a conversão...");

    try {
      const ffmpeg = new FFmpeg();
      setFeedback("Carregando FFmpeg...");
      await ffmpeg.load(); // Load FFmpeg

      setFeedback("Carregando o arquivo de vídeo...");
      const videoBlob = await fetchFile(video);
      const videoName = video.name;

      // Gerar o nome do GIF com base na data e hora atual
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().replace(/[^\w]/g, "-");
      const outputFileName = `${formattedDate}.gif`;

      // Store video file in FFmpeg's virtual file system
      ffmpeg.writeFile(videoName, new Uint8Array(videoBlob));

      setFeedback("Processando vídeo para GIF...");
      // FFmpeg command to convert the video to a GIF
      const command = [
        '-i', videoName,               // Input video file
        '-vf', 'fps=10,scale=320:-1',  // Optional: set FPS and size for the GIF (adjust as needed)
        outputFileName                 // Dynamic output file name
      ];

      // Execute FFmpeg command
      await ffmpeg.exec(command);

      setFeedback("Finalizando a conversão...");

      // Read the output GIF from FFmpeg's virtual file system
      const outputData = await ffmpeg.readFile(outputFileName);

      // Create a Blob URL from the output data
      const blob = new Blob([outputData], { type: 'image/gif' });
      const gifUrl = URL.createObjectURL(blob);

      setGifUrl(gifUrl);
      setGifFileName(outputFileName);  // Store the dynamically generated file name for later use
      setLoading(false);
      setFeedback("GIF criado com sucesso!");
    } catch (error) {
      console.error('Error creating GIF:', error);
      setLoading(false);
      setFeedback("Erro ao criar o GIF. Tente novamente.");
    }
  };

  // Handle form submit
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
