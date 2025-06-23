"use client"
import { FeaturesSection } from "./components/features-section";
import { Header } from "./components/header";
import { PreviewSection } from "./components/preview-section";
import { UploadSection } from "./components/upload-section";
import { useVideoConverter } from "./hooks/use-video-converter.hook";

export default function VideoConverterPage() {
  const { viewModel, fileInputRef } = useVideoConverter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
      <main className="max-w-4xl mx-auto">
        <Header />

        <div className="grid lg:grid-cols-2 gap-8">
          <UploadSection viewModel={viewModel} fileInputRef={fileInputRef} />
          <PreviewSection viewModel={viewModel} />
        </div>

        <FeaturesSection />
      </main>

      <footer className="mt-16 text-center text-sm text-gray-500 pb-8">
        &copy; 2024 Leandro Ferreira — Conversor de GIF com FFmpeg + Next.js
      </footer>
    </div>
  );
}
