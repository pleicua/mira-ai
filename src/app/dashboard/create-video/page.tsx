'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import {
  Upload,
  Video as VideoIcon,
  Sparkles,
  Play,
  Download,
  RotateCcw,
  Save,
  X
} from 'lucide-react';

export default function CreateVideoPage() {
  const { user, updateCredits } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('');
  const [duration, setDuration] = useState('5s');
  const [style, setStyle] = useState('realista');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string>('');

  const durations = [
    { value: '3s', label: '3 segundos' },
    { value: '5s', label: '5 segundos' },
    { value: '10s', label: '10 segundos' },
    { value: '15s', label: '15 segundos' },
  ];

  const styles = [
    { value: 'realista', label: 'Realista' },
    { value: 'anime', label: 'Anime' },
    { value: 'cinematico', label: 'Cinematográfico' },
    { value: '3d', label: '3D' },
    { value: 'fantasia', label: 'Fantasia' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file);
      setUploadedImageUrl(url);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedVideo(file);
      const url = URL.createObjectURL(file);
      setUploadedVideoUrl(url);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setUploadedImageUrl('');
  };

  const removeUploadedVideo = () => {
    setUploadedVideo(null);
    setUploadedVideoUrl('');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Por favor, insira um prompt');
      return;
    }

    if ((user?.credits || 0) < 5) {
      alert('Créditos insuficientes. Vídeos custam 5 créditos.');
      return;
    }

    setIsGenerating(true);

    try {
      // Simular geração de vídeo (mock)
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Mock de vídeo gerado
      const mockVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

      setGeneratedVideo(mockVideo);

      // Deduzir créditos
      updateCredits(-5);

      // Salvar no banco de dados
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user?.id,
          title: prompt.substring(0, 50) + '...',
          type: 'video',
          prompt,
          duration,
          style,
          thumbnail_url: 'https://picsum.photos/300/200?random=video',
          file_url: mockVideo,
        });

      if (error) throw error;

    } catch (error) {
      console.error('Erro ao gerar vídeo:', error);
      alert('Erro ao gerar vídeo. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = 'generated-video.mp4';
      link.click();
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleSave = () => {
    alert('Vídeo salvo nos projetos! (simulado)');
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Criar Vídeo</h1>
          <p className="text-slate-400">Descreva a cena ou movimento desejado</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva a cena ou movimento desejado..."
                className="w-full h-32 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none p-4"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Duração
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent p-3"
              >
                {durations.map((d) => (
                  <option key={d.value} value={d.value} className="bg-slate-700">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Estilo
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent p-3"
              >
                {styles.map((s) => (
                  <option key={s.value} value={s.value} className="bg-slate-700">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Opções de Upload</h3>

              {/* Image to Video */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Image-to-Video (opcional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
                  >
                    {uploadedImageUrl ? (
                      <div className="relative">
                        <img
                          src={uploadedImageUrl}
                          alt="Uploaded"
                          className="max-h-28 max-w-full rounded"
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeUploadedImage();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-400">Upload de imagem</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Video to Video */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Video-to-Video (opcional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-purple-500 transition-colors"
                  >
                    {uploadedVideoUrl ? (
                      <div className="relative">
                        <video
                          src={uploadedVideoUrl}
                          className="max-h-28 max-w-full rounded"
                          controls={false}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeUploadedVideo();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <VideoIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-400">Upload de vídeo</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Gerar Vídeo
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Vídeo Gerado</h2>

            {!generatedVideo ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
                <VideoIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Nenhum vídeo gerado</h3>
                <p className="text-slate-400">Preencha o prompt e clique em "Gerar Vídeo"</p>
              </div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                <video
                  src={generatedVideo}
                  controls
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownload}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    <button
                      onClick={handleRegenerate}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Regenerar
                    </button>
                  </div>
                  <button
                    onClick={handleSave}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Salvar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}