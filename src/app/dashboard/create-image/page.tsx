'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Settings,
  Download,
  RotateCcw,
  Plus,
  Eye,
  EyeOff,
  X
} from 'lucide-react';

export default function CreateImagePage() {
  const { user, updateCredits } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [model, setModel] = useState('realista');
  const [size, setSize] = useState('1:1');
  const [steps, setSteps] = useState(20);
  const [cfgScale, setCfgScale] = useState(7);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const models = [
    { value: 'realista', label: 'Realista' },
    { value: 'anime', label: 'Anime' },
    { value: '3d', label: '3D' },
    { value: 'fantasia', label: 'Fantasia' },
  ];

  const sizes = [
    { value: '1:1', label: 'Quadrado (1:1)' },
    { value: '9:16', label: 'Retrato (9:16)' },
    { value: '16:9', label: 'Paisagem (16:9)' },
    { value: '4:5', label: 'Retrato (4:5)' },
    { value: 'livre', label: 'Livre' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file);
      setUploadedImageUrl(url);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setUploadedImageUrl('');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Por favor, insira um prompt');
      return;
    }

    if ((user?.credits || 0) < 1) {
      alert('Créditos insuficientes');
      return;
    }

    setIsGenerating(true);

    try {
      // Simular geração de imagem (mock)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock de imagens geradas
      const mockImages = [
        'https://picsum.photos/512/512?random=1',
        'https://picsum.photos/512/512?random=2',
        'https://picsum.photos/512/512?random=3',
        'https://picsum.photos/512/512?random=4',
      ];

      setGeneratedImages(mockImages);

      // Deduzir créditos
      updateCredits(-1);

      // Salvar no banco de dados
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user?.id,
          title: prompt.substring(0, 50) + '...',
          type: 'image',
          prompt,
          negative_prompt: negativePrompt,
          model,
          size,
          steps,
          cfg_scale: cfgScale,
          thumbnail_url: mockImages[0],
          file_url: mockImages[0],
        });

      if (error) throw error;

    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'generated-image.jpg';
    link.click();
  };

  const handleUpscale = (imageUrl: string) => {
    // Mock upscale
    alert('Upscale aplicado! (simulado)');
  };

  const handleVariations = (imageUrl: string) => {
    // Mock variações
    alert('Gerando variações... (simulado)');
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handlePublishToProjects = (imageUrl: string) => {
    alert('Imagem publicada nos projetos! (simulado)');
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Criar Imagem</h1>
          <p className="text-slate-400">Descreva o que deseja criar e deixe a IA fazer a magia</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Prompt Principal
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Descreva o que deseja criar..."
                className="w-full h-32 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none p-4"
              />
            </div>

            {/* Negative Prompt */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Prompt Negativo (opcional)
              </label>
              <textarea
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="O que você NÃO quer na imagem..."
                className="w-full h-24 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none p-4"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Modelo
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent p-3"
              >
                {models.map((m) => (
                  <option key={m.value} value={m.value} className="bg-slate-700">
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tamanho da Imagem
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent p-3"
              >
                {sizes.map((s) => (
                  <option key={s.value} value={s.value} className="bg-slate-700">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced Settings Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <Settings className="h-4 w-4" />
              Configurações Avançadas
              {showAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-4 bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                {/* Steps */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Steps: {steps}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* CFG Scale */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    CFG Scale: {cfgScale}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={cfgScale}
                    onChange={(e) => setCfgScale(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Upload Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Opções de Upload</h3>

              {/* Image to Image */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Image-to-Image (opcional)
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
                        <p className="text-slate-400">Clique para fazer upload</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Remove BG */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remove-bg" className="rounded" />
                <label htmlFor="remove-bg" className="text-slate-300 text-sm">
                  Remover fundo da imagem
                </label>
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
                  Gerar Imagem
                </>
              )}
            </button>
          </div>

          {/* Results */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Imagens Geradas</h2>

            {generatedImages.length === 0 ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center">
                <ImageIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Nenhuma imagem gerada</h3>
                <p className="text-slate-400">Preencha o prompt e clique em "Gerar Imagem"</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((imageUrl, index) => (
                  <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3 space-y-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDownload(imageUrl)}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs py-2 px-3 rounded flex items-center justify-center gap-1 transition-colors"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </button>
                        <button
                          onClick={() => handleUpscale(imageUrl)}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs py-2 px-3 rounded flex items-center justify-center gap-1 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          Upscale
                        </button>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleVariations(imageUrl)}
                          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs py-2 px-3 rounded flex items-center justify-center gap-1 transition-colors"
                        >
                          <RotateCcw className="h-3 w-3" />
                          Variações
                        </button>
                        <button
                          onClick={() => handlePublishToProjects(imageUrl)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 px-3 rounded flex items-center justify-center gap-1 transition-colors"
                        >
                          <ImageIcon className="h-3 w-3" />
                          Publicar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {generatedImages.length > 0 && (
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleRegenerate}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Regenerar
                </button>
                <button
                  onClick={() => setGeneratedImages([])}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Limpar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}